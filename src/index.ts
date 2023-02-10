type EventName = string | "newListener" | "error";
type ListenerID = string;
type EventListenersMap = { [name: string]: number[] };
type EventOptions = { global?: boolean };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CallBack = (...args: any) => any;

type GlobalListenStorage = {
  listeners: (CallBack | null)[];
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
 * @param options (Object| Optional) An optional object for additional configuration. For example <strong>{global: true}</strong>, it will use the global event storage which is helpful for multi component apps to emit and listen events from different component.
 * @returns (Object) Event listener
 */
export class PandaEvents {
  #useGlobals = false;
  #listeners: (CallBack | null)[] = [];
  #eventListenersMap: EventListenersMap = {};
  #onceMap: number[] = [];

  #errEventName = "error";
  #newListenerEventName = "newListener";
  #removeListenerEventName = "removeListener";

  constructor(options: EventOptions = { global: true }) {
    this.#useGlobals = options.global ? true : false;

    this.#listeners = this.#useGlobals ? globalListenStorage.listeners : [];

    this.#eventListenersMap = this.#useGlobals
      ? globalListenStorage.eventListenersMap
      : {};

    this.#onceMap = this.#useGlobals ? globalListenStorage.onceMap : [];
  }

  /**
   * Modify error event name
   */
  set errorEventName(name: string) {
    this.#errEventName = name;
  }

  /**
   * Modify event name for new listener
   */
  set newListenerEventName(name: string) {
    this.#newListenerEventName = name;
  }

  /**
   * Modify event name for removal of a listener
   */
  set removeListenerEventName(name: string) {
    this.#removeListenerEventName = name;
  }

  /**
   * Stores the events and the listeners also determines whether the method will be called once
   *
   * @param eventName (String) The name of the event
   * @param callBack (Function) The callback function
   * @param once (Boolean | Optional) Default false, it determines whether the method will be called once
   * @returns (String) Event Id
   */
  #execOnAndOnce(
    eventName: EventName,
    callBack: CallBack,
    once = false
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

    const cbs = this.#eventListenersMap[eventName] ?? [];
    const length = this.#listeners.push(callBack);
    const listenerID = length - 1;

    cbs.push(listenerID);
    this.#eventListenersMap[eventName] = cbs;

    const evtListener = `${listenerID}@${eventName}`;

    if (once) {
      this.#onceMap.push(listenerID);
    }

    if (
      ![
        this.#newListenerEventName,
        this.#errEventName,
        this.#removeListenerEventName,
      ].includes(eventName)
    ) {
      this.emit(this.#newListenerEventName, eventName, callBack);
    }
    return evtListener;
  }

  /**
   * Register listener for an event, the listener will be executed only one time for emitting the event and will get removed
   *
   * @param eventName
   * @param callBack
   * @returns (String) Event Id
   */
  once(eventName: EventName, callBack: CallBack): ListenerID {
    const id = this.#execOnAndOnce(eventName, callBack, true);
    return id;
  }

  /**
   * Register listener for an event, the listener will be executed whenever the event is emitted
   *
   * @param eventName
   * @param callBack
   * @returns (String) Event Id
   */
  on(eventName: EventName, callBack: CallBack): ListenerID {
    const id = this.#execOnAndOnce(eventName, callBack, false);
    return id;
  }

  /**
   * Trigger an event that was registered through the 'on' or 'once' method, corresponding listeners will get executed with provided arguments
   *
   * @param eventName
   * @param args
   */
  emit(eventName: string, ...args: unknown[]): void {
    const evIds = this.#eventListenersMap[eventName];
    if (evIds && Array.isArray(evIds)) {
      const onceArr: ListenerID[] = [];
      evIds.forEach((ev) => {
        const fn = this.#listeners[ev] as CallBack;
        if (this.#onceMap.includes(ev)) {
          onceArr.push(`${ev}@${eventName}`);
        }

        if (typeof fn === "function") {
          setTimeout(async () => {
            try {
              await fn(...args);
            } catch (err) {
              const errListeners = this.#eventListenersMap[this.#errEventName];
              if (Array.isArray(errListeners) && errListeners.length > 0) {
                this.emit(this.#errEventName, err, eventName);
              } else {
                throw err;
              }
            }
          });
        }
      });
      this.removeAllListenersById(onceArr);
    }
  }

  /**
   * Remove a listener by the event Id (Which was returned through the 'on' or 'once' method during the registration of the listener)
   *
   * @param listenerID
   * @returns
   */
  removeListenerById(listenerID: ListenerID) {
    return this.removeAllListenersById(listenerID);
  }

  /**
   * Remove a listener by the event Id (Which was returned through the 'on' or 'once' method during the registration of the listener)
   *
   * @param Array listenerID or Array of Listener Ids
   */
  removeAllListenersById(listenerID: ListenerID | ListenerID[]) {
    const ids = Array.isArray(listenerID) ? listenerID : [listenerID];
    ids.forEach((id) => {
      const [listenerIndexStr, ...eventNameArr] = id.split("@");
      const listenerIndex = Number(listenerIndexStr);
      const eventName = eventNameArr.join("@");

      Array.isArray(this.#eventListenersMap[eventName]) &&
        this.#eventListenersMap[eventName].length > 0 &&
        this.#eventListenersMap[eventName].includes(listenerIndex) &&
        this.#eventListenersMap[eventName].splice(
          this.#eventListenersMap[eventName].indexOf(listenerIndex),
          1
        );

      let removedListener: null | CallBack = null;

      if (this.#listeners[listenerIndex]) {
        removedListener = this.#listeners[listenerIndex];
        this.#listeners[listenerIndex] = null;
      }

      this.#onceMap.includes(listenerIndex) &&
        this.#onceMap.splice(this.#onceMap.indexOf(listenerIndex), 1);

      if (removedListener) {
        this.emit(this.#removeListenerEventName, eventName, removedListener);
      }
    });
  }

  /**
   * Removes all listeners for a specified event
   *
   * @param eventName
   * @param listener
   * @returns
   */
  off(eventName: EventName, listener: CallBack) {
    return this.removeEventListener(eventName, listener);
  }

  /**
   * Removes all listeners for a specified event
   *
   * @param eventName
   * @param listener
   */
  removeEventListener(eventName: EventName, listener: CallBack) {
    const index = this.#listeners.indexOf(listener);
    if (index !== -1) {
      const evtName = `${index}@${eventName}`;
      this.removeListenerById(evtName);
    }
  }

  /**
   * Removes all the listeners for given event
   *
   * @param eventName
   */
  removeAllEventListeners(eventName: string): void {
    const evtIds = this.#eventListenersMap[eventName];
    if (evtIds && Array.isArray(evtIds)) {
      const handlers = evtIds.map((id) => `${id}@${eventName}`);
      this.removeAllListenersById(handlers);
    }
  }
}

export function pandaEvents(options: EventOptions = {}): PandaEvents {
  return new PandaEvents(options);
}

const events = { PandaEvents, pandaEvents };
export default events;
