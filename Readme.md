promise.rsvp
---

[![NPM version](http://img.shields.io/npm/v/promise.rsvp.svg?style=flat)](https://npmjs.org/package/promise.rsvp)
[![Build Status](http://img.shields.io/travis/xuxihai123/promise.rsvp/master.svg?style=flat)](http://travis-ci.org/xuxihai123/promise.rsvp)

Promise events listen base on native Promise ,like rsvp.js

**Features:**  

🔥 unhandleReject catch.  
🚀 created/rejected/fulfilled listen. 

## Installation

```bash
npm install promise.rsvp
```

## Usage

```js
function listener (event) {
  event.eventName // one of ['created', 'chained', 'fulfilled', 'rejected']
  event.result    // fulfillment value
  event.error     // reject reason
  event.stack     // stack at the time of the event. (if  'instrument-with-stack' is true)
}
```

## overide native Promise

```js
require('promise.rsvp').setup();
// events
Promise.on('created', listener);
Promise.on('chained', listener);
Promise.on('fulfilled', listener);
Promise.on('rejected', listener);
```

## use PromiseRsvp

```js
const PromiseRsvp=require('promise.rsvp');
// events
PromiseRsvp.on('created', listener);
PromiseRsvp.on('chained', listener);
PromiseRsvp.on('fulfilled', listener);
PromiseRsvp.on('rejected', listener);
```
