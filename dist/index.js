"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _collapse = _interopRequireDefault(require("./collapse"));
var _collapse2 = require("./collapse.schema");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = {
  component: _collapse.default,
  schema: _collapse2.schema,
  ui: _collapse2.ui
};
exports.default = _default;
module.exports = exports.default;