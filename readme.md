# PandaEvents 🐼

PandaEvents is a lite weight JavaScript library compatible with TypeScript, simplifying event-driven app building. It provides tools for async operations, custom events, and complex event flows. Designed for browser-based apps but also usable in Node.js, it has an intuitive API for easy event creation and management.

## Let's understand what's the role of an Event listener and how the PandaEvents comes into the picture.

Let's first understand what an event listener does in a nutshell.

Have you ever clicked a button and noticed that something happens as a result? That's what happens when we use event listeners in web development. An event listener is like a special function that detects for something to happen, like a button click. When the button is clicked, the event listener knows to run a specific function that was defined beforehand. This process allows us to make our web pages interactive and responsive to what the user does.

Well, that's awesome. The browser gives us the capability to perform event-driven operations with DOM elements (i.e Buttons, Input boxes, Div, etc). But what about achieving the same thing without a DOM element? think of Node.JS where we don't have any DOM elements but still, we use it to make event-driven programs effectively, right? there is a built-in module available in Node.js called EventEmitter that allows to do such things and the PandaEvents is also created following the same concept to bring that awesomeness **with or without Node.js**. maybe in your **browser**.

So, pandaEvents is a flexible solution that can be integrated into **any JavaScript or TypeScript application**, whether it uses **vanilla JavaScript** code or a modular system with multiple components like **Vue.js**, **React**, **React Native**, and even **Node.js** applications.

## Installation

PandaEvents can be installed easily as a package through **NPM** or **Yarn**, and also can be used in your web application through **CDN** (ESM is also available through CDN)

**NPM or Yarn**

npm install [package]

or

yarn add [package]

**CDN**

[[link]](https://)

(ESM)

[link](https://)

## Getting started

Earlier, we studied how to install the library. Now, let's learn how to access the Event object or the core event emitter class in the PandaEvents library.

The PandaEvents library exports three items: the method **pandaEvents**, the class **PandaEvents**, and the default export "events" which holds both "pandaEvents" (function) and "PandaEvents" (class).

Let's see how we can use them programatically.

```
//Imporing the pandaEvents method
import {pandaEvents} from "[package]";
//Getting instance of the emitter through the pandaEvents() method
const e= pandaEvents();
```

Or

```
//Importing the PandaEvents class
import {PandaEvents} from "[package]";
//Creating instance
const e= new PandaEvents();
```

Or

```
//Imporing the default exported object which contains both the method and the class
import events from "[package]"
//we either call the method in the way written below
const e= evants.pandaEvents();
//or, we can create instance of the class
const e1= new evants.PandaEvents();
```

## Creating an event listener

Before emitting any event, it's required to register the event name and the listener or the call-back function. Using a single PandaEvents instance you can register multiple events and for an event you may have more than one listener (callback)

**Note that**, each time you register an listener, it gives an **Listener Id** which is very unique to the event and that listener. The Id can be used to keep track also to remove the listener

**Syantx**

```
e.on(event, listener);
** We mentioned that once you registers a listener, it will give you an Listener ID.
** So, you can surely assign that into a variable as it's written below.
const listenerId= e.on(event, listener);
```

## Emitting an event

The `emit()` method is used to trigger an event by providing an event name which is registered and any necessary arguments, `emit()`activates any listeners or callbacks that have been registered for that event. These listeners will then receive the arguments passed through`emit()`, allowing them to perform the desired action.

**Syntax**

```
e.emit(event, arg1, arg2, ...);
```

## Example

```
const e = pandaEvents()
// Registering to myEvent
e.on('myEvent', (msg) => {
   console.log(msg);
});
// Triggering myEvent
e.emit('myEvent', "Hello panda 🐼");
```

Output

```
Hello panda 🐼
```

**Note that**, the listener for an event should be initiated before emitting the event, otherwise they will not be listening.

## Removing listener

There is a couple of approaches available to remove an event, pick any of them that suits your requirements.

`removeEventListener(event, listener)` - Allows to remove a specific listener for the given event name.

**Example**

```
// Defining our listeners or the call back function
function firstCallBack(){ console.log("Log from firstCallBack"); }
function secondCallBack(){ console.log("Log from secondCallBack") }
//Creating an event and assigning the listners/call-backs difined above to it
e.on("test", firstCallBack);
e.on("test", secondCallBack);
// Removing the first listener
e.removeEventListener("test", firstCallBack);
// Let's try emitting the event now
e.emit("test");
```

Output

```
Log from secondCallBack
```

Explanation: As we removed the listener `firstCallBack` at third step for the event `test`. So, after emitting the event only the `secondCallBack` was executed.

`off(event, listener)` - This works the same as `removeEventListener(event, listener)` that we explained above, the name was just shortened for coolness.

**Note that**, In order to remove a listener using `removeEventListener` or `off` you need to define your listener(s) or the call-back(s) separately to refer to the same listener while removing. Notice the example for `removeEventListener` to see how we defined `first callback` and `secondCallBack` separately and used.

`removeAllEventListeners(event)` - Removes all the listeners for the given event name.

If you know Node.js EventEmitter most probably you can relate all the methods given above. Here PandaEvents provides some more methods to delete.

`removeListenerById(listenerId)` - As we already explained, whenever we create listener for an event it returns a unique listener id, using the `removeListenerById()` we can remove a listener based on the event id.

Example

```
//Initiate an event and the listener
const listenerId= e.on("test", ()=>{ console.log("Hello test") });
//Removing the listener by the listener id
e.removeListenerById(listenerId);
```

`removeAllListenersById(listenerId | [listenerId1, listenerId2, ...])` - Just like `removeListenerById` it also removes the listener for given listener id, alternatively we can pass an array of listener ids, that we want to delete together;

## Handling errors

PandaEvents has one default event called `error` to hanle errors. Even if we are not handling errors in our given listener function or the callback, it does the job for us.

Syntax

```
e.on("error", (error, event)=>{ /* Your code here */ })
```

Example

```
// Registration of the listener to the event 'error' to handle errors
e.on('error', (error, event)=>{
  console.log("Error appeared for -", event);
  console.log("Error is -", error)
})
// Registration for our event and listner where an error will be triggered
e.on("testEvent", ()=>{ throw new Error("It's an error.") });
// Triggering the event
e.emit("test")
```

**Output**

```
Error appeared for - testEvent
Error is - Error: It's an error
```

**Note that**, we can modify default error handler event name `error`, there is a name modifier `errorEventName` available for that.

**Syntax & Example**

```
// Modification of default error handler event name from "error" to "anyError"
e.errorEventName= "anyError";
//Now we can write our error handler like this
e.on("anyError", (error, event)=>{ /* Code here */ });
```

## Handling asynchronus operations

PandaEvents handles async handlers or callbacks just like regular functions and maintains all the flows and works with error handler just like a regular function, there no special setup required for that

**Syntax**

```
e.on(eventName, async function(){ /*Code here*/ })
```

## Handling the scope of the events and listener's storage

By default it does not matter as many instance you created through `pandaEvents()` method or `new PandaEvents()` by default they use to share the **global storage**, i.e each of them having access to others. you can stop them and limit it to instance only by providing an argument `{global: false}`

Let's understand with an **example** of **global storage**

```
// Creating three different instance of the event emitter
const e1= pandaEvents();
const e2= new PandaEvents();
const e3= events.pandaEvents();
// Assigning an event and and listener at e1
e1.on("test", (from)=>{ console.log("I am getting triggered from", from) });
// Now lets trigger event from all those three instances
e1.emit("test", "e1");
e2.emit("test", "e2");
e3emit("test", "e3");
```

**Output**

```
I am getting triggered from e1
I am getting triggered from e2
I am getting triggered from e3
```

Now, lets take an **example** by limiting the storage only into the instance

```
// Creating three different instance of the event emitter
const e1= pandaEvents({global: false});
const e2= new PandaEvents({global: false});
const e3= events.pandaEvents();
// Assigning an event and and listener at e3
e3.on("test", (from)=>{ console.log("I am getting triggered from", from) });
// Now lets trigger event from all those three instances
e1.emit("test", "e1");
e2.emit("test", "e2");
e3emit("test", "e3");
```

**Output**

```
I am getting triggered from e3
```

So, `e1` and `e2` has no global storage access as we creted the instances with `{global:false}` so the event `test` and corresponding listener is unknown to them and only working while we emitting through `e3`, all though if we create another instance with global access i.e`{global: true}` or with a `blank` argument that will use the global storage and the event test would known to them.

Here we can create event and listener for `e1` and `e2` and they will limited to them only.

## Default events

PandaEvents provides some default events for each instance, they use to get triggered automatically when you create a listener or remove a listener and if an unhandled error occurs.

**`newListener`** - each time you registers an listener, each instance of PandaEvents use to trigger another event named `newListener`. A listener function can be attached to it in order to receive informtions like eventName and the callBack function and to process as we want

**Syntax**

```
e.on("newListener", (eventName, callBack)=>{ /* Your code here*/ })
```

You can modify the listener name `newListener` if you want. there is a property `newListenerEventName` which can be used to modify the name.

**Example**

```
// Modifying new listeener hadling event name
const e.newListenerEventName= "listenerCreated";

//Now we can write the detection handler like this
e.on("listenerCreated", (event, callBack)=>{ /* Code here */ })
```

**`removeListener`** - during removal of an listener, PandaEvents use to trigger an event named `removeListener`. A listener function can be attached to it in order to receive informtions like eventName and the removedListener and to process as we want.

**Syntax**

```
e.on('removeListener', (event, removedListener)=>{ /*Code here*/ })
```

We can modify the default event removal handler name `removeListener` using the name modifier `removeListenerEventName`

**Syntax and Example**

```
// Modifying error removal handling event name
e.removeListenerEventName= "evtRemoved";

// Now we can write our detection handler like this.
e.on("evtRemoved", (event, removedListener)=>{ /*Code here*/ });
```

**`error`** - We refer to look at the [Handling Errors](#handling-errors) section to understand this event better.

## Extending the PandaEvents class

The class `PandasEvents` can be inherited to create a custom event emitter or to limit the accessibility of the event handler throughout the class only or through its instances.

**Note that**, only extending the class will cause using the global event handler storage. To limit the storage access only to it's instances, consider passing `{global: false}` to the parent class (i.e PandaEvents) constructor.

**Example**

```
Class App extends PandaEvents{
   constructor(){
      super({global: false}); // Limitting the event listener storage to this class only
   }
   listen(){
    // An example method, where we can access all the panda events method with `this` keyword
    this.on("test", ()=>{ /* Do something */ })
   }
}
```
