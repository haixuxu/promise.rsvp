/*!
 * PromiseRsvp v1.0.0
 * (c) 2014-2018 xuxihai
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.PromiseRsvp = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function callbacksFor(object) {
	  var callbacks = object._promiseCallbacks;
	  if (!callbacks) {
	    callbacks = object._promiseCallbacks = {};
	  }
	  return callbacks;
	}

	var events = {
	  mixin: function(object) {
	    object.on = this.on;
	    object.off = this.off;
	    object.trigger = this.trigger;
	    object._promiseCallbacks = undefined;
	    return object;
	  },
	  on: function(eventName, callback) {
	    if (typeof callback !== "function") {
	      throw new TypeError("Callback must be a function");
	    }
	    var allCallbacks = callbacksFor(this);
	    var callbacks = allCallbacks[eventName];
	    if (!callbacks) {
	      callbacks = allCallbacks[eventName] = [];
	    }
	    if (callbacks.indexOf(callback) === -1) {
	      callbacks.push(callback);
	    }
	  },
	  off: function(eventName, callback) {
	    var allCallbacks = callbacksFor(this);
	    if (!callback) {
	      allCallbacks[eventName] = [];
	      return;
	    }
	    var callbacks = allCallbacks[eventName];
	    var index = callbacks.indexOf(callback);
	    if (index !== -1) {
	      callbacks.splice(index, 1);
	    }
	  },
	  trigger: function(eventName, options, label) {
	    var allCallbacks = callbacksFor(this);
	    var callbacks = allCallbacks[eventName];
	    if (callbacks) {
	      var callback = void 0;
	      for (var i = 0; i < callbacks.length; i++) {
	        callback = callbacks[i];
	        callback(options, label);
	      }
	    }
	  }
	};

	var config = {
	  instrument: false
	};

	events['mixin'](config);

	function configure(name, value) {
	  if (arguments.length === 2) {
	    config[name] = value;
	  } else {
	    return config[name];
	  }
	}

	var config_1=config;
	var configure_1=configure;
	config_1.configure = configure_1;

	var defer = function defer(Promise) {
	  var deferred = { resolve: undefined, reject: undefined };

	  deferred.promise = new Promise(function (resolve, reject) {
	    deferred.resolve = resolve;
	    deferred.reject = reject;
	  });

	  return deferred;
	};

	var queue = [];

	function scheduleFlush() {
	  setTimeout(function () {
	    for (var i = 0; i < queue.length; i++) {
	      var entry = queue[i];
	      config_1['trigger'](entry.name, entry.payload);
	    }
	    queue.length = 0;
	  }, 0);
	}

	var instrument = function(eventName, promise, result, error) {
	  if (1 === queue.push({
	        name: eventName,
	        payload: {
	          eventName: eventName,
	          promise: promise,
	          result: result,
	          error: error,
	          stack: config_1['instrument-with-stack'] ? new Error('promise->' + promise.$id+' stack').stack : null,
	        },
	      })) {
	    scheduleFlush();
	  }
	};

	var OriginalPromise = Promise;
	var $id = 0;

	function PromiseRsvp(resolver) {
	  if (!(this instanceof PromiseRsvp)) {
	    throw new TypeError('Cannot call a class as a function');
	  }
	  $id++;
	  var promise = new OriginalPromise(function (resolve, reject) {
	    var customResolve = function (result) {
	      setTimeout(function() {
	        instrument('fulfilled', promise, result);
	      });
	      return resolve(result);
	    };
	    var customReject = function (reason) {
	      // macro-task(setTimeout) will execute after micro-task(promise)
	      setTimeout(function () {
	        instrument('rejected', promise, null, reason);

	        if (promise._hasDownstreams !== true) {
	          instrument('error', promise, null, reason);
	        } else {
	          return reject(reason);
	        }
	      }, 0);
	    };
	    try {
	      return resolver(customResolve, customReject);
	    } catch (err) {
	      return customReject(err);
	    }
	  });
	  promise.$id = $id;
	  promise.__proto__ = PromiseRsvp.prototype;
	  instrument('created', promise);
	  return promise;
	}

	PromiseRsvp.__proto__ = Promise;
	PromiseRsvp.prototype.__proto__ = Promise.prototype;

	PromiseRsvp.prototype.then = function(onFulfilled, onRejected) {
	  this._hasDownstreams = true;
	  return OriginalPromise.prototype.then.call(this, onFulfilled, onRejected);
	};


	PromiseRsvp.on=config_1.on.bind(config_1);
	PromiseRsvp.off=config_1.off.bind(config_1);
	PromiseRsvp.configure=config_1.configure;
	PromiseRsvp.deferred = defer.bind(commonjsGlobal,PromiseRsvp);

	PromiseRsvp.setup = function() {
	  commonjsGlobal.Promise = PromiseRsvp;
	};
	var src = PromiseRsvp;

	return src;

})));
