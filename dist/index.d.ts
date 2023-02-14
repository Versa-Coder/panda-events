declare type EventName = string | "newListener" | "error";
declare type ListenerID = string;
declare type EventOptions = {
    global?: boolean;
};
declare type CallBack = (...args: any) => any;
/**
 * Returns the event listener object
 *
 * @param options (Object| Optional) An optional object for additional configuration. For example <strong>{global: true}</strong>, it will use the global event storage which is helpful for multi component apps to emit and listen events from different component.
 * @returns (Object) Event listener
 */
export declare class PandaEvents {
    #private;
    constructor(options?: EventOptions);
    /**
     * Modify error event name
     */
    set errorEventName(name: string);
    /**
     * Modify event name for new listener
     */
    set newListenerEventName(name: string);
    /**
     * Modify event name for removal of a listener
     */
    set removeListenerEventName(name: string);
    /**
     * Register listener for an event, the listener will be executed only one time for emitting the event and will get removed
     *
     * @param eventName
     * @param callBack
     * @returns (String) Event Id
     */
    once(eventName: EventName, callBack: CallBack): ListenerID;
    /**
     * Register listener for an event, the listener will be executed whenever the event is emitted
     *
     * @param eventName
     * @param callBack
     * @returns (String) Event Id
     */
    on(eventName: EventName, callBack: CallBack): ListenerID;
    /**
     * Trigger an event that was registered through the 'on' or 'once' method, corresponding listeners will get executed with provided arguments
     *
     * @param eventName
     * @param args
     */
    emit(eventName: string, ...args: unknown[]): void;
    /**
     * Remove a listener by the event Id (Which was returned through the 'on' or 'once' method during the registration of the listener)
     *
     * @param listenerID
     * @returns
     */
    removeListenerById(listenerID: ListenerID): void;
    /**
     * Remove a listener by the event Id (Which was returned through the 'on' or 'once' method during the registration of the listener)
     *
     * @param Array listenerID or Array of Listener Ids
     */
    removeAllListenersById(listenerID: ListenerID | ListenerID[]): void;
    /**
     * Removes all listeners for a specified event
     *
     * @param eventName
     * @param listener
     * @returns
     */
    off(eventName: EventName, listener: CallBack): void;
    /**
     * Removes all listeners for a specified event
     *
     * @param eventName
     * @param listener
     */
    removeEventListener(eventName: EventName, listener: CallBack): void;
    /**
     * Removes all the listeners for given event
     *
     * @param eventName
     */
    removeAllEventListeners(eventName: string): void;
}
export declare function pandaEvents(options?: EventOptions): PandaEvents;
declare const events: {
    PandaEvents: typeof PandaEvents;
    pandaEvents: typeof pandaEvents;
};
export default events;
