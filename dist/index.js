"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PandaEvents_instances, _PandaEvents_useGlobals, _PandaEvents_listeners, _PandaEvents_eventListenersMap, _PandaEvents_onceMap, _PandaEvents_errEventName, _PandaEvents_newListenerEventName, _PandaEvents_removeListenerEventName, _PandaEvents_execOnAndOnce;
Object.defineProperty(exports, "__esModule", { value: true });
exports.pandaEvents = exports.PandaEvents = void 0;
const globalListenStorage = {
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
class PandaEvents {
    constructor(options = {}) {
        _PandaEvents_instances.add(this);
        _PandaEvents_useGlobals.set(this, false);
        _PandaEvents_listeners.set(this, []);
        _PandaEvents_eventListenersMap.set(this, {});
        _PandaEvents_onceMap.set(this, []);
        _PandaEvents_errEventName.set(this, "error");
        _PandaEvents_newListenerEventName.set(this, "newListener");
        _PandaEvents_removeListenerEventName.set(this, "removeListener");
        __classPrivateFieldSet(this, _PandaEvents_useGlobals, options.global ? true : false, "f");
        __classPrivateFieldSet(this, _PandaEvents_listeners, __classPrivateFieldGet(this, _PandaEvents_useGlobals, "f") ? globalListenStorage.listeners : [], "f");
        __classPrivateFieldSet(this, _PandaEvents_eventListenersMap, __classPrivateFieldGet(this, _PandaEvents_useGlobals, "f")
            ? globalListenStorage.eventListenersMap
            : {}, "f");
        __classPrivateFieldSet(this, _PandaEvents_onceMap, __classPrivateFieldGet(this, _PandaEvents_useGlobals, "f") ? globalListenStorage.onceMap : [], "f");
    }
    /**
     * Modify error event name
     */
    set errorEventName(name) {
        __classPrivateFieldSet(this, _PandaEvents_errEventName, name, "f");
    }
    /**
     * Modify event name for new listener
     */
    set newListenerEventName(name) {
        __classPrivateFieldSet(this, _PandaEvents_newListenerEventName, name, "f");
    }
    /**
     * Modify event name for removal of a listener
     */
    set removeListenerEventName(name) {
        __classPrivateFieldSet(this, _PandaEvents_removeListenerEventName, name, "f");
    }
    /**
     * Register listener for an event, the listener will be executed only one time for emitting the event and will get removed
     *
     * @param eventName
     * @param callBack
     * @returns (String) Event Id
     */
    once(eventName, callBack) {
        let id = __classPrivateFieldGet(this, _PandaEvents_instances, "m", _PandaEvents_execOnAndOnce).call(this, eventName, callBack, true);
        return id;
    }
    /**
     * Register listener for an event, the listener will be executed whenever the event is emitted
     *
     * @param eventName
     * @param callBack
     * @returns (String) Event Id
     */
    on(eventName, callBack) {
        let id = __classPrivateFieldGet(this, _PandaEvents_instances, "m", _PandaEvents_execOnAndOnce).call(this, eventName, callBack, false);
        return id;
    }
    /**
     * Trigger an event that was registered through the 'on' or 'once' method, corresponding listeners will get executed with provided arguments
     *
     * @param eventName
     * @param args
     */
    emit(eventName, ...args) {
        let evIds = __classPrivateFieldGet(this, _PandaEvents_eventListenersMap, "f")[eventName];
        if (evIds && Array.isArray(evIds)) {
            let onceArr = [];
            evIds.forEach((ev) => {
                let fn = __classPrivateFieldGet(this, _PandaEvents_listeners, "f")[ev];
                if (__classPrivateFieldGet(this, _PandaEvents_onceMap, "f").includes(ev)) {
                    onceArr.push(`${ev}@${eventName}`);
                }
                if (typeof fn === "function") {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield fn(...args);
                        }
                        catch (err) {
                            let errListeners = __classPrivateFieldGet(this, _PandaEvents_eventListenersMap, "f")[__classPrivateFieldGet(this, _PandaEvents_errEventName, "f")];
                            if (Array.isArray(errListeners) && errListeners.length > 0) {
                                this.emit(__classPrivateFieldGet(this, _PandaEvents_errEventName, "f"), err, eventName);
                            }
                            else {
                                throw err;
                            }
                        }
                    }));
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
    removeListenerById(listenerID) {
        return this.removeAllListenersById(listenerID);
    }
    /**
     * Remove a listener by the event Id (Which was returned through the 'on' or 'once' method during the registration of the listener)
     *
     * @param Array listenerID or Array of Listener Ids
     */
    removeAllListenersById(listenerID) {
        let ids = Array.isArray(listenerID) ? listenerID : [listenerID];
        ids.forEach((id) => {
            const [listenerIndexStr, ...eventNameArr] = id.split("@");
            const listenerIndex = Number(listenerIndexStr);
            const eventName = eventNameArr.join("@");
            Array.isArray(__classPrivateFieldGet(this, _PandaEvents_eventListenersMap, "f")[eventName]) &&
                __classPrivateFieldGet(this, _PandaEvents_eventListenersMap, "f")[eventName].length > 0 &&
                __classPrivateFieldGet(this, _PandaEvents_eventListenersMap, "f")[eventName].includes(listenerIndex) &&
                __classPrivateFieldGet(this, _PandaEvents_eventListenersMap, "f")[eventName].splice(__classPrivateFieldGet(this, _PandaEvents_eventListenersMap, "f")[eventName].indexOf(listenerIndex), 1);
            let removedListener = null;
            if (__classPrivateFieldGet(this, _PandaEvents_listeners, "f")[listenerIndex]) {
                removedListener = __classPrivateFieldGet(this, _PandaEvents_listeners, "f")[listenerIndex];
                __classPrivateFieldGet(this, _PandaEvents_listeners, "f")[listenerIndex] = null;
            }
            __classPrivateFieldGet(this, _PandaEvents_onceMap, "f").includes(listenerIndex) &&
                __classPrivateFieldGet(this, _PandaEvents_onceMap, "f").splice(__classPrivateFieldGet(this, _PandaEvents_onceMap, "f").indexOf(listenerIndex), 1);
            if (removedListener) {
                this.emit(__classPrivateFieldGet(this, _PandaEvents_removeListenerEventName, "f"), eventName, removedListener);
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
    off(eventName, listener) {
        return this.removeEventListener(eventName, listener);
    }
    /**
     * Removes all listeners for a specified event
     *
     * @param eventName
     * @param listener
     */
    removeEventListener(eventName, listener) {
        const index = __classPrivateFieldGet(this, _PandaEvents_listeners, "f").indexOf(listener);
        if (index !== -1) {
            let evtName = `${index}@${eventName}`;
            this.removeListenerById(evtName);
        }
    }
    /**
     * Removes all the listeners for given event
     *
     * @param eventName
     */
    removeAllEventListeners(eventName) {
        let evtIds = __classPrivateFieldGet(this, _PandaEvents_eventListenersMap, "f")[eventName];
        if (evtIds && Array.isArray(evtIds)) {
            let handlers = evtIds.map((id) => `${id}@${eventName}`);
            this.removeAllListenersById(handlers);
        }
    }
}
exports.PandaEvents = PandaEvents;
_PandaEvents_useGlobals = new WeakMap(), _PandaEvents_listeners = new WeakMap(), _PandaEvents_eventListenersMap = new WeakMap(), _PandaEvents_onceMap = new WeakMap(), _PandaEvents_errEventName = new WeakMap(), _PandaEvents_newListenerEventName = new WeakMap(), _PandaEvents_removeListenerEventName = new WeakMap(), _PandaEvents_instances = new WeakSet(), _PandaEvents_execOnAndOnce = function _PandaEvents_execOnAndOnce(eventName, callBack, once = false) {
    var _a;
    if (typeof eventName !== "string") {
        throw new Error(`Event name should be a string, "${typeof eventName}" given`);
    }
    else if (typeof callBack !== "function") {
        throw new Error(`callBack should be a function, "${typeof callBack}" given`);
    }
    let cbs = (_a = __classPrivateFieldGet(this, _PandaEvents_eventListenersMap, "f")[eventName]) !== null && _a !== void 0 ? _a : [];
    let length = __classPrivateFieldGet(this, _PandaEvents_listeners, "f").push(callBack);
    let listenerID = length - 1;
    cbs.push(listenerID);
    __classPrivateFieldGet(this, _PandaEvents_eventListenersMap, "f")[eventName] = cbs;
    let evtListener = `${listenerID}@${eventName}`;
    if (once) {
        __classPrivateFieldGet(this, _PandaEvents_onceMap, "f").push(listenerID);
    }
    if (![
        __classPrivateFieldGet(this, _PandaEvents_newListenerEventName, "f"),
        __classPrivateFieldGet(this, _PandaEvents_errEventName, "f"),
        __classPrivateFieldGet(this, _PandaEvents_removeListenerEventName, "f"),
    ].includes(eventName)) {
        this.emit("newListener", eventName, callBack);
    }
    return evtListener;
};
function pandaEvents(options = {}) {
    return new PandaEvents(options);
}
exports.pandaEvents = pandaEvents;
const events = { PandaEvents, pandaEvents };
exports.default = events;
