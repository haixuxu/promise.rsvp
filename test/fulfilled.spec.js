require('../lib').setup();

var assert = require('assert');

describe('fulfilled Event listen', function() {
  afterEach(function(done) {
    Promise.off('fulfilled');
    setTimeout(function() {
      done();
    }, 300);
  });

  it('case listen fulfilled event', function(done) {
    var result = [];
    Promise.on('fulfilled', function(event) {
      result.push(event.result);
    });
    var promiseA = new Promise(function(resolve, reject) {
      resolve(12);  // resolve 1
    });
    var promiseC = Promise.resolve(34); // resolve 2

    promiseA.then(function(result) {
      return result; //resolve 3
    });
    Promise.resolve().then(result => { //resolve 4 , 5
      return 56;
    });
    setTimeout(function() {
      assert.equal(result.length, 5);
      assert.deepEqual(result, [ 12, 34, undefined, 12, 56 ]);
      done();
    }, 200);
  });
});
