'use strict';

const zoomer = require('./zoomer');

function getTopZui(zuiInstance) {
  if (zuiInstance.parent) {
    return getTopZui(zuiInstance.parent);
  }
  return zuiInstance;
}

function getInitialZoomLevel(zuiInstance, level) {
  if (zuiInstance.parent !== zuiInstance) {
    return getInitialZoomLevel(zuiInstance.parent, level + 1);
  }
  return level;
}

function Zui(opts) {
  if (opts.window !== opts.window.top) {
    this.top = getTopZui(this);
    this.parent = opts.parent ? opts.parent : new Zui(opts.window.parent);
  } else {
    this.top = this;
    this.parent = this;
  }

  this.zoomLevel = getInitialZoomLevel(this, 1);
  this.cover = opts.cover;
  this.window = opts.window;
  this.children = [];
}

Zui.prototype.message = function message(eventName, data) {
  this.window.postMessage({eventName, data}, '*');
};

Zui.prototype.zoomOut = function zoomOut() {
  this.parent.message('zoomOut');
};

Zui.prototype.zoomTo = function zoomIn(coverEl) {
  const zui = this.children.find(zui => zui.cover === coverEl);

  if (!zui) {
    return;
  }

  zoomer.zoomTo(zui.cover);
  zui.message('zoomIn');
};

Zui.prototype.cascadeZoomLevel = function cascadeZoomLevel(level) {
  this.zoomLevel = level;
  this.message('setZoomLevel', {level});
}

module.exports = Zui;
