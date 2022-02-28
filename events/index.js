// Node中的发布订阅者 模式
const EventsEmitter = require('events');
// es6之前Node提供的继承方法
const { inherits } = require('util');

function Girl() {}

inherits(Girl, EventsEmitter);

const girl = new Girl();

// 批处理
let flag = false;

// 注意：绑定事件时触发newListener，会立即emit newListener监听函数，但是随之绑定的函数并没有放入队列中
// 所以无法触发 总结： 绑定事件-》触发newListener-》之后才会将绑定的事件推入队列中
girl.on('newListener', (type) => {
  console.log('监听到注册的事件:', type);
  if (!flag) {
    process.nextTick(() => {
      girl.emit(type);
    });
    flag = true;
  }
});

// 仅仅执行一次 触发后删除
// girl.once('over', () => {
//   console.log('哭了');
// });

girl.on('over', () => {
  console.log('吃东西');
});

girl.on('over', drinkWine);

girl.on('over', () => {
  console.log('逛街');
});

// girl.emit('over');
// 触发一次后移除喝酒
// girl.off('over', drinkWine);
// girl.emit('over');
//
function drinkWine() {
  console.log('喝酒');
}
