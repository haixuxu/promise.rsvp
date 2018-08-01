require('../lib/promise.rsvp').setup();

var assert = require('assert');

describe('rejected Event listen', function() {
  beforeEach(function(done) {
    Promise.off('rejected');
    setTimeout(function() {
      done();
    }, 300);
  });

  it('case listen rejected event', function(done) {
    var result = [];
    Promise.on('rejected', function(event) {
      result.push(event.error);
    });
    var promiseA = new Promise(function(resolve, reject) {
      //new promise 1
      reject(12);
    });
    var promiseC = Promise.reject(34); // new promise 2
    //
    promiseA.then(function(result) {
      //new promise 3
      // console.log(result);
    });
    Promise.resolve().then(result => { //promise 4 , 5
      throw Error(56);
    });
    setTimeout(function() {
      assert.equal(result.length, 4);
      assert.equal(result[0], 12);
      assert.equal(result[1], 34);
      assert.equal(result[2].message, 56);
      assert.equal(result[3], 12);
      done();
    }, 200);
  });
});
