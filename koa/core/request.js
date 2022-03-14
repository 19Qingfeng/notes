const parse = require('parseurl');

// 维护request逻辑
const request = {
  get path() {
    return parse(this.req).pathname;
  },
  get url() {
    return this.req.url;
  },
  get method() {
    return this.req.method;
  },
};

module.exports = request;
