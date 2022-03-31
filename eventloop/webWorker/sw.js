// static/scripts/worker.js

// self.onmessage = function (event) {
//   console.log(`worker inner: ${event.data}`);
// };

onmessage = function (e) {
  console.log('Worker: Message received from main script');
  // const result = e.data[0] * e.data[1];
  // if (isNaN(result)) {
  //   postMessage('Please write two numbers');
  // } else {
  //   const workerResult = 'Result: ' + result;
  //   console.log('Worker: Posting message back to main script');
  //   postMessage(workerResult);
  // }
  self.postMessage('hello');
};

onmessageerror = function (e) {
  console.log(e, 'e');
};
