function callbacksFor(object) {
  var callbacks = object._promiseCallbacks;
  if (!callbacks) {
    callbacks = object._promiseCallbacks = {};
  }
  return callbacks;
}

module.exports = {
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
