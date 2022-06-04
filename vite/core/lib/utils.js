const path = require('path');

function normalizePath(id) {
  return id.replace(/\\/g, '/');
}

module.exports = {
  normalizePath,
};
