// 手写复习发布订阅模式
function EventsEmitter() {}

EventsEmitter.prototype.on = function (eventName, callback) {
  this._events || (this._events = {});
  const queue = this._events[eventName] || (this._events[eventName] = []);

  if (eventName !== 'newListener') {
    this.emit('newListener', eventName);
  }

  queue.push(callback);
};

EventsEmitter.prototype.once = function (eventName, callback) {
  this._events || (this._events = {});
  const queue = this._events[eventName] || (this._events[eventName] = []);

  const _once = (...args) => {
    callback(...args);
    this.off(eventName, _once);
  };

  _once._once = callback;
  queue.push(_once);
};

EventsEmitter.prototype.off = function (eventName, callback) {
  this._events || (this._events = {});

  const queue = this._events[eventName] || (this._events[eventName] = []);

  this._events[eventName] = queue.filter(
    (fn) => fn !== callback && fn._once !== callback
  );
};

EventsEmitter.prototype.emit = function (eventName, ...args) {
  this._events || (this._events = {});
  const queue = this._events[eventName] || (this._events[eventName] = []);
  queue.forEach((fn) => fn(...args));
};

// Test

const events = Object.create(EventsEmitter.prototype);

events.on('newListener', function (type) {
  process.nextTick(() => {
    events.emit(type, '19Qingfeng');
  });
});

function first(params) {
  console.log('hello', params);
}
events.on('hello', first);

// events.off('hello', first);

// events.once('hello', (params) => {
//   console.log('hello x 2', params);
// });

// events.emit('hello', '19Qingfeng');
