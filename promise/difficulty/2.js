// 等待整理过程和结果

Promise.resolve()
  .then(() => {
    console.log('1');
    return 'k';
  })
  .then((res) => {
    console.log(res);
  });

Promise.resolve()
  .then(() => {
    console.log('2');
  })
  .then(() => {
    console.log('3');
  })
  .then(() => {
    console.log('4');
  })
  .then(() => {
    console.log('5');
  })
  .then(() => {
    console.log('6');
  });

// the second

Promise.resolve()
  .then(() => {
    console.log('1');
    return Promise.resolve('k');
  })
  .then((res) => {
    console.log(res);
  });

Promise.resolve()
  .then(() => {
    console.log('2');
  })
  .then(() => {
    console.log('3');
  })
  .then(() => {
    console.log('4');
  })
  .then(() => {
    console.log('5');
  })
  .then(() => {
    console.log('6');
  });

[1, 2, micro, 3, micro, 4, k, 5, 6];
