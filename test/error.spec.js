require('../lib').setup();

var assert = require('assert');

describe('Error handler', function() {
  afterEach(function(done) {
    Promise.off('error');
    setTimeout(function() {
      done();
    }, 300);
  });

  it('case only create(error handler on global error event)', function(done) {
    Promise.on('error', function(event) {
      assert.equal(1111, event.error.message);
      done();
    });
    var promise = new Promise(function(resolve, reject) {
      throw Error(1111);
    });
  });
  it('case create=>then(error handler on global error event)', function(done) {
    Promise.on('error', function(event) {
      assert.equal(1111, event.error.message);
      done();
    });

    new Promise(function(resolve, reject) {
      throw Error(1111);
    }).then(function(result) {
      console.log(result);
    });
  });
  it('case Promise.reject(error handler on global error event)', function(done) {
    Promise.reject(2222);
    Promise.on('error', function(event) {
      assert.equal(event.error, 2222);
      done();
    });
  });
  it('case create=>catch(error handler on catch)', function(done) {
    var promise = new Promise(function(resolve, reject) {
      throw Error(1111);
    });
    promise.catch(function(err) {
      assert.equal(1111, err.message);
      done();
    });
    Promise.on('error', function(event) {
      throw Error('error');
    });
  });
  it('case create=>then=>catch(error handler on catch)', function(done) {
    var promise = new Promise(function(resolve, reject) {
      throw Error(1111);
    });
    promise.then(function(result) {
      console.log(result);
    }).catch(function(err) {
      assert.equal(1111, err.message);
      done();
    });
    Promise.on('error', function(event) {
      throw Error('error');
    });
  });
});
