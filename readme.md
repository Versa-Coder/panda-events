## PandaEvents

PandaEvents is a powerful lite weight JavaScript library for building event-driven applications, handling asynchronous operations, and customizing events and listeners in an elegant way. The library is specially designned for browser based applications although this is eqally powerful for Node.JS applications.

PandaEvents is a versatile and lightweight JavaScript library that simplifies the process of building event-driven applications. It provides a comprehensive set of tools for handling asynchronous operations, creating custom events and listeners, and managing complex event flows. This library is specially designed for browser-based applications, but it can also be used in Node.js environments to enhance the event management of your application. With its intuitive API, PandaEvents makes it easy to create and manage events, allowing developers to focus on building the core functionality of their applications. Whether you're working on a single-page web app or a complex web-based system, PandaEvents has the features you need to build robust and responsive event-driven applications.

#### Installation

PandaEvents can be installed easily as a package through NPM or Yarn, and also can be used in your web application through CDN (ESM is also available through CDN)

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
import {pandaEvents} from "[package]";
const e= pandaEvents();
```
