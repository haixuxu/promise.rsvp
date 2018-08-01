require('../lib').setup();

const assert = require("assert");

/**
 * https://www.zhihu.com/question/36972010
 * http://www.ituring.com.cn/article/66566
 */
describe("macrotask/microtask sequece", function() {
  it("new Promise line=>exec Promise resolver=>next line code=>promise.then=>setTimeout", function(done) {
    const result = [];
    setTimeout(function() {
      result.push(4);
    }, 0);
    new Promise(function(resolve) {
      result.push(1);
      for (let i = 0; i < 10000; i++) {
        i === 9999 && resolve();
      }
      result.push(2);
    }).then(function() {
      result.push(5);
    });
    result.push(3);

    setTimeout(function() {
      assert.deepEqual(result, [1, 2, 3, 5, 4]);
      done();
    }, 200);
  });
});
