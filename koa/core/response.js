// 维护response逻辑
const response = {
  _body: null,
  get body() {
    return this._body;
  },
  set body(value) {
    this.res.statusCode = 200;
    this._body = value;
  },
};

module.exports = response;
