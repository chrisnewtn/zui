'use strict';

const Zui = require('./Zui');

function SubZui(opts) {
  Zui.call(this, opts);
}

SubZui.prototype = Object.create(Zui.prototype);
SubZui.prototype.constructor = SubZui;

SubZui.prototype.zoomIn = function zoomIn() {
  this.parent.zoomTo(this);
};

module.exports = SubZui;
