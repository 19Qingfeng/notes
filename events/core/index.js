function EventsEmitter() {}

// 注册事件
EventsEmitter.prototype.on = function (eventName, callback) {
  if (!this._events) {
    this._events = {};
  }

  (this._events[eventName] || (this._events[eventName] = [])).push(callback);
};

// 绑定单次：触发一次后销毁
EventsEmitter.prototype.once = function (eventName, callback) {
  if (!this._events) {
    this._events = {};
  }

  const onceFn = (...params) => {
    callback(...params);
    this.off(eventName, onceFn);
  };

  // 为了删除引用地址相同，增加标记位
  onceFn._once = callback;

  // 添加进入
  (this._events[eventName] || (this._events[eventName] = [])).push(onceFn);
};

// 取消注册
EventsEmitter.prototype.off = function (eventName, callback) {
  if (!this._events) {
    this._events = {};
  }
  if (this._events[eventName]) {
    this._events[eventName] = this._events[eventName].filter(
      (fn) => fn !== callback && fn._once !== callback
    );
  }
};

// 触发
EventsEmitter.prototype.emit = function (eventName, ...args) {
  if (!this._events) {
    this._events = {};
  }
  const events = this._events[eventName];
  if (events) {
    events.forEach((event) => event(...args));
  }
};

module.exports = EventsEmitter;
