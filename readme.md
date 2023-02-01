## PandaEvents 🐼

PandaEvents is a versatile and lightweight JavaScript library which is also compatible with TypeScript that simplifies the process of building event-driven applications. It provides a comprehensive set of tools for handling asynchronous operations, creating custom events and listeners, and managing complex event flows. This library is specially designed for browser-based applications, but it can also be used in Node.js environments to enhance the event management of your application. With its intuitive API, PandaEvents makes it easy to create and manage events, allowing developers to focus on building the core functionality of their applications. Whether you're working on a single-page web app or a complex web-based system, PandaEvents has the features you need to build robust and responsive event-driven applications. PandaEvents can be used with TypeScript aswell significantly.

#### Let's understand what's the role of an Event listener and how the PandaEvents comes into the picture.

Let's first understand what an event listener does in a nutshell.

Have you ever clicked a button and noticed that something happens as a result? That's what happens when we use event listeners in web development. An event listener is like a special function that detects for something to happen, like a button click. When the button is clicked, the event listener knows to run a specific function that was defined beforehand. This process allows us to make our web pages interactive and responsive to what the user does.

Well, that's awesome. The browser gives us the capability to perform event-driven operations with DOM elements (i.e Buttons, Input boxes, Div, etc). But what about achieving the same thing without a DOM element? think of Node.JS where we don't have any DOM elements but still, we use it to make event-driven programs effectively, right? there is a built-in module available in Node.js called EventEmitter that allows to do such things and the PandaEvents is also created following the same concept to bring that awesomeness **with or without Node.js**. maybe in your **browser**.

So, pandaEvents is a flexible solution that can be integrated into **any JavaScript or TypeScript application**, whether it uses **vanilla JavaScript** code or a modular system with multiple components like **Vue.js**, **React**, **React Native**, and even **Node.js** applications.

#### Installation

PandaEvents can be installed easily as a package through **NPM** or **Yarn**, and also can be used in your web application through **CDN** (ESM is also available through CDN)

**NPM or Yarn**

npm install [package]

or

yarn add [package]

**CDN**

[[link]](https://)

(ESM)

[link](https://)

#### Getting started

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

#### Creating an event listener

Before emitting any event, it's required to register the event name and the listener or the call-back function. Using a single PandaEvents instance you can register multiple events and for an event you may have more than one listener (callback)

Note that, each time you register an listener, it gives an **Listener Id** which is very unique to the event and that listener. The Id can be used to keep track also to remove the listener

**Syantx**

```
e.on(event, listener);

** We mentioned that once you registers a listener, it will give you an Listener ID.
** So, you can surely assign that into a variable as it's written below.

const listenerId= e.on(event, listener);
```

#### Emitting an event

The `emit()` method is used to trigger an event by providing an event name which is registered and any necessary arguments, `emit()`activates any listeners or callbacks that have been registered for that event. These listeners will then receive the arguments passed through`emit()`, allowing them to perform the desired action.

**Syntax**

```
e.emit(event, arg1, arg2, ...);
```

#### Example

```
const e = pandaEvents()

// Registering to myEvent
e.on('myEvent', (msg) => {
   console.log(msg);
});

// Triggering myEvent
e.emit('myEvent', "Hello panda 🐼");
```

##### Output

```
Hello panda 🐼
```
