'use strict';

const Zui = require('./Zui');

function SubZui(opts) {
  Zui.call(this, opts);
}

Object.assign(SubZui.prototype, Zui.prototype);

module.exports = SubZui;
