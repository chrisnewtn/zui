'use strict';

const zoomer = require('./zoomer');
const zuiEl = require('./zuiEl');

function updateZoomClass(level){
  zuiEl.classList.remove('level-3', 'level-2', 'level-1', 'invisible');

  if (level < 1 || level > 3) {
    zuiEl.classList.add('invisible');
  } else {
    zuiEl.classList.add(`level-${level}`);
  }
}

function getChildZuis(zuiInstance, window) {
  return Array.from(window.document.querySelectorAll('.sub-zui')).map(subZuiEl => {
    return new Zui({
      window: subZuiEl.querySelector('iframe').contentWindow,
      parent: zuiInstance,
      cover: subZuiEl.querySelector('.cover')
    });
  });
}

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
  this.children = getChildZuis(this, opts.window);

  updateZoomClass(this.zoomLevel);
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

Zui.prototype.setZoomLevel = function setZoomLevel(level, source) {
  this.zoomLevel = level;
  this.children.filter(zui => zui.window !== source).forEach(zui => zui.cascadeZoomLevel(level + 1));

  if (this.parent !== this && this.parent.window !== source) {
    this.parent.cascadeZoomLevel(level - 1);
  }

  updateZoomClass(level);
};

module.exports = Zui;
