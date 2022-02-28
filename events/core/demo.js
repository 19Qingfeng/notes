const EventsEmitter = require('./index');
const { inherits } = require('util');

function Girl() {}

inherits(Girl, EventsEmitter);

const girl = new Girl();

const shopping = (param) => console.log('购物', param);
const cry = (param) => console.log('哭', param);
const eat = (param) => console.log('吃', param);

girl.on('newListener', (type) => {
  console.log(type);
});

girl.on('done', shopping);
girl.once('done', cry);
girl.once('done', eat);
girl.once('done', eat);

// girl.emit('done', 'param');
// girl.emit('done', 'param');

// TODO: 剩余newListener 处理
