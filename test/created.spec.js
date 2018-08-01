require('../lib').setup();

var assert = require('assert');

describe('created Event listen', function() {
  afterEach(function(done) {
    Promise.off('created');
    setTimeout(function() {
      done();
    }, 300);
  });
  it('case listen created event', function(done) {
    var result = [];
    Promise.on('created', function(event) {
      result.push(event.promise);
    });
    var promiseA = new Promise(function(resolve, reject) {
      //new promise 1
      resolve(12);
    });
    var promiseB = Promise.resolve(22); // new promise 2
    var promiseC = Promise.reject(33); // new promise 3

    promiseA.then(function(result) {
      //new promise 4
      // console.log(result);
    });
    promiseB.catch(err => {
      //new promise 5
      console.log(err);
    });
    setTimeout(function() {
      assert.equal(result.length, 5);
      done();
    }, 200);
  });
});
