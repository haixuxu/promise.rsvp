const config = require('./config');
const deferFactory = require('./defer');
const instrument = require('./instrument');

const OriginalPromise = Promise;
let $id = 0;

function PromiseRsvp(resolver) {
  if (!(this instanceof PromiseRsvp)) {
    throw new TypeError('Cannot call a class as a function');
  }
  $id++;
  const promise = new OriginalPromise((resolve, reject) => {
    const customResolve = result => {
      setTimeout(function() {
        instrument('fulfilled', promise, result);
      });
      return resolve(result);
    };
    const customReject = reason => {
      // macro-task(setTimeout) will execute after micro-task(promise)
      setTimeout(() => {
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


PromiseRsvp.on=config.on.bind(config);
PromiseRsvp.off=config.off.bind(config);
PromiseRsvp.configure=config.configure;
PromiseRsvp.deferred = deferFactory.bind(this,PromiseRsvp);

PromiseRsvp.setup = function() {
  global.Promise = PromiseRsvp;
};
module.exports = PromiseRsvp;

