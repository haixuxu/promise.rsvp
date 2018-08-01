var config = require('./config');

const queue = [];

function scheduleFlush() {
  setTimeout(() => {
    for (let i = 0; i < queue.length; i++) {
      let entry = queue[i];
      config['trigger'](entry.name, entry.payload);
    }
    queue.length = 0;
  }, 0);
}

module.exports = function(eventName, promise, result, error) {
  if (1 === queue.push({
        name: eventName,
        payload: {
          eventName: eventName,
          promise: promise,
          result: result,
          error: error,
          stack: config['instrument-with-stack'] ? new Error('promise->' + promise.$id+' stack').stack : null,
        },
      })) {
    scheduleFlush();
  }
};
