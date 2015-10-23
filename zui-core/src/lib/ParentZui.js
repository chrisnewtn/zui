'use strict';

const Zui = require('./Zui');
const SubZui = require('./SubZui');
const zuiEl = require('./zuiEl');
const windowEvents = require('./windowEvents');

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
    return new SubZui({
      window: subZuiEl.querySelector('iframe').contentWindow,
      parent: zuiInstance,
      cover: subZuiEl.querySelector('.cover')
    });
  });
}

function ParentZui(opts) {
  Zui.call(this, opts);
  this.children = getChildZuis(this, opts.window);
  updateZoomClass(this.zoomLevel);
  windowEvents.listen(this);
}

ParentZui.prototype = Object.create(Zui.prototype);
ParentZui.prototype.constructor = ParentZui;

ParentZui.prototype.setZoomLevel = function setZoomLevel(level, source) {
  this.zoomLevel = level;
  this.children.filter(zui => zui.window !== source).forEach(zui => zui.cascadeZoomLevel(level + 1));

  if (this.parent !== this && this.parent.window !== source) {
    this.parent.cascadeZoomLevel(level - 1);
  }

  updateZoomClass(level);
};

ParentZui.prototype.removeCover = function removeCover(source) {
  const zui = this.children.find(zui => zui.window === source);

  if (!zui) {
    return;
  }

  zui.cover.classList.add('loaded');

  setTimeout(() => {
    zui.cover.classList.add('transparent');
    zui.cover.classList.remove('loaded')
  }, 500);
};

ParentZui.prototype.appendChild = function appendChild(opts) {
  let iframe = document.createElement('iframe');
  iframe.src = `zuis/${opts.name}`;

  let zuiOpts = {
    parent: this,
    cover: document.createElement('div')
  };

  zuiOpts.cover.className = 'cover';

  let subZuiEl = document.createElement('div');

  subZuiEl.className = 'sub-zui';
  subZuiEl.appendChild(iframe);
  subZuiEl.appendChild(zuiOpts.cover);
  zuiEl.querySelector('.right').appendChild(subZuiEl);

  zuiOpts.window = iframe.contentWindow;

  let zuiInstance = new SubZui(zuiOpts);

  this.children.push(zuiInstance);

  return zuiInstance;
};

module.exports = ParentZui;
