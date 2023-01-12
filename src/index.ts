type EventName = string;
type ListenerID = string;
type EventListenersMap = { [name: string]: number[] };
type EventOptions = { global?: boolean };
type GlobalListenStorage = {
  listeners: (Function | null)[];
  eventListenersMap: EventListenersMap;
  onceMap: number[];
};

const globalListenStorage: GlobalListenStorage = {
  listeners: [],
  eventListenersMap: {},
  onceMap: [],
};

/**
 * Returns the event listener object
 *
 * @param options (Object| Optional) An optional object for additional configuration. For example {global: true}, it will use the global event storage which is helpful for multi component apps to emit and listen events from different component.
 * @returns (Object) Event listener
 */
const pandaEvents = function (options: EventOptions = {}) {
  const useGlobals = options.global ? true : false;

  const listeners: (Function | null)[] = useGlobals
    ? globalListenStorage.listeners
    : [];
  const eventListenersMap: EventListenersMap = useGlobals
    ? globalListenStorage.eventListenersMap
    : {};
  const onceMap: number[] = useGlobals ? globalListenStorage.onceMap : [];

  let errEventName = "error";

  /**
   * Stores the events and the listeners also determines whether the method will be called once
   *
   * @param eventName (String) The name of the event
   * @param callBack (Function) The callback function
   * @param once (Boolean | Optional) Default false, it determines whether the method will be called once
   * @returns (String) Event Id
   */
  const execOnAndOnce = function (
    eventName: string,
    callBack: Function,
    once: boolean = false
  ): ListenerID {
    if (typeof eventName !== "string") {
      throw new Error(
        `Event name should be a string, "${typeof eventName}" given`
      );
    } else if (typeof callBack !== "function") {
      throw new Error(
        `callBack should be a function, "${typeof callBack}" given`
      );
    }

    let cbs = eventListenersMap[eventName] ?? [];
    let length = listeners.push(callBack);
    let listenerID = length - 1;
    cbs.push(listenerID);
    eventListenersMap[eventName] = cbs;

    let evtListener = `${listenerID}@${eventName}`;

    if (once) {
      onceMap.push(listenerID);
    }
    return evtListener;
  };

  return {
    set errorEventName(name: string) {
      errEventName = name;
    },

    /**
     * Register event and the listener, the listener will be executed
     *
     * @param eventName
     * @param callBack
     * @returns
     */
    once(eventName: string, callBack: Function): ListenerID {
      let id = execOnAndOnce(eventName, callBack, true);
      this.emit("newListener", eventName, callBack);
      return id;
    },

    /**
     *
     * @param eventName
     * @param callBack
     * @returns
     */
    on(eventName: string, callBack: Function): ListenerID {
      let id = execOnAndOnce(eventName, callBack, false);
      this.emit("newListener", eventName, callBack);
      return id;
    },

    /**
     *
     * @param eventName
     * @param args
     */
    emit(eventName: string, ...args: unknown[]): void {
      let evIds = eventListenersMap[eventName];
      if (evIds && Array.isArray(evIds)) {
        let onceArr: ListenerID[] = [];
        evIds.forEach((ev) => {
          let fn = listeners[ev] as Function;
          if (onceMap.includes(ev)) {
            onceArr.push(`${ev}@${eventName}`);
          }

          if (typeof fn === "function") {
            setTimeout(async () => {
              try {
                await fn(...args);
              } catch (err) {
                let errListeners = eventListenersMap[errEventName];
                if (Array.isArray(errListeners) && errListeners.length > 0) {
                  this.emit(errEventName, err);
                } else {
                  throw err;
                }
              }
            });
          }
        });
        this.removeAllListenersById(onceArr);
      }
    },

    /**
     *
     * @param listenerID
     * @returns
     */
    removeListenerById(listenerID: ListenerID) {
      return this.removeAllListenersById(listenerID);
    },

    /**
     *
     * @param listenerID
     */
    removeAllListenersById(listenerID: ListenerID | ListenerID[]) {
      let ids = Array.isArray(listenerID) ? listenerID : [listenerID];
      ids.forEach((id) => {
        const [listenerIndexStr, ...eventNameArr] = id.split("@");
        const listenerIndex = Number(listenerIndexStr);
        const eventName = eventNameArr.join("@");

        Array.isArray(eventListenersMap[eventName]) &&
          eventListenersMap[eventName].length > 0 &&
          eventListenersMap[eventName].includes(listenerIndex) &&
          eventListenersMap[eventName].splice(
            eventListenersMap[eventName].indexOf(listenerIndex),
            1
          );

        listeners[listenerIndex] && (listeners[listenerIndex] = null);

        onceMap.includes(listenerIndex) &&
          onceMap.splice(onceMap.indexOf(listenerIndex), 1);
      });
    },

    /**
     *
     * @param eventName
     * @param listener
     * @returns
     */
    off(eventName: EventName, listener: Function) {
      return this.removeEventListener(eventName, listener);
    },

    /**
     *
     * @param eventName
     * @param listener
     */
    removeEventListener(eventName: EventName, listener: Function) {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        let evtName = `${index}@${eventName}`;
        this.removeListenerById(evtName);
      }
    },

    /**
     *
     * @param eventName
     */
    removeAllEventListeners(eventName: string): void {
      let evtIds = eventListenersMap[eventName];
      if (evtIds && Array.isArray(evtIds)) {
        let handlers = evtIds.map((id) => `${id}@${eventName}`);
        this.removeAllListenersById(handlers);
      }
    },
  };
};

export default pandaEvents;
