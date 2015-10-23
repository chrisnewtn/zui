(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

const zuiEl = require('./lib/zuiEl');
const zoomer = require('./lib/zoomer');
const windowEvents = require('./lib/windowEvents');
const Zui = require('./lib/ParentZui');

const zui = new Zui({window});

function onClick(e) {
  if (e.target.classList.contains('up')) {
    zui.zoomOut();
  }

  let el = e.target;

  if (el.classList.contains('cover')) {
    return zui.zoomTo(el);
  } else {
    zuiEl.style.transform = '';
  }
}

if (zui.parent !== zui) {
  zui.parent.message('loaded');
}

window.zui = zui;

zuiEl.addEventListener('click', onClick);
windowEvents.listen(zui);

},{"./lib/ParentZui":2,"./lib/windowEvents":5,"./lib/zoomer":6,"./lib/zuiEl":7}],2:[function(require,module,exports){
'use strict';

const Zui = require('./Zui');
const SubZui = require('./SubZui');
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

module.exports = ParentZui;

},{"./SubZui":3,"./Zui":4,"./zuiEl":7}],3:[function(require,module,exports){
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

},{"./Zui":4}],4:[function(require,module,exports){
'use strict';

const zoomer = require('./zoomer');

function getChild(children, target) {
  if (target instanceof Zui) {
    return children.find(zui => zui === target);
  }
  if (target instanceof HTMLElement) {
    return children.find(zui => zui.cover === target);
  }
  if (target.Window && target instanceof target.Window) {
    return children.find(zui => zui.window === target);
  }
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
  this.children = [];
}

Zui.prototype.message = function message(eventName, data) {
  this.window.postMessage({eventName, data}, '*');
};

Zui.prototype.zoomOut = function zoomOut() {
  this.parent.message('zoomOut');
};

Zui.prototype.zoomIn = function zoomIn() {
  this.parent.message('zoomTo');
};

Zui.prototype.zoomTo = function zoomTo(target) {
  const zui = getChild(this.children, target);

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

},{"./zoomer":6}],5:[function(require,module,exports){
'use strict';

const zoomer = require('./zoomer');

function onMessage(event, zui) {
  if(!event.data || !event.data.eventName){
    return;
  }

  let eventName = event.data.eventName;

  if (eventName === 'zoomOut') {
    zui.setZoomLevel(1);
    zoomer.zoomOut();
    return;
  }
  if (eventName === 'zoomIn') {
    zui.setZoomLevel(1);
    return;
  }
  if (eventName === 'zoomTo') {
    zui.zoomTo(event.source);
    return;
  }
  if (eventName === 'setZoomLevel') {
    zui.setZoomLevel(event.data.data.level, event.source);
    return;
  }
  if (eventName === 'loaded') {
    zui.removeCover(event.source);
    return;
  }
}

function listen(zui) {
  window.addEventListener('message', e => onMessage(e, zui), false);
}

exports.listen = listen;

},{"./zoomer":6}],6:[function(require,module,exports){
'use strict';

const zuiEl = require('./zuiEl');
var transformStringCache;

function getTranslationToZui(el) {
  let zuiCenterX = zuiEl.offsetWidth / 2;
  let zuiCenterY = zuiEl.offsetHeight / 2;

  let centerX = el.offsetLeft + (el.offsetWidth / 2);
  let centerY = el.offsetTop + (el.offsetHeight / 2);

  return {
    x: zuiCenterX - centerX,
    y: zuiCenterY - centerY
  };
}

function getScaleToZui(el) {
  let elSize = Math.max(el.offsetWidth, el.offsetHeight);
  let zuiSize = Math.max(zuiEl.offsetWidth, zuiEl.offsetHeight);

  return Math.round(zuiSize / elSize);
}

function zoomTo(el) {
  let translate = getTranslationToZui(el);
  let scale = getScaleToZui(el);

  let tX = translate.x * scale;
  let tY = translate.y * scale;

  let transformString = `translate(${tX}px, ${tY}px) scale(${scale})`;
  transformStringCache = transformString;

  if (transformString !== zuiEl.style.transform) {
    zuiEl.style.transform = transformString;
    setTimeout(el => {
      zuiEl.classList.add('no-transition');
      zuiEl.style.transform = '';

      let iframe = el.parentElement.querySelector('iframe');
      iframe.classList.add('parent');

      Array.from(zuiEl.querySelectorAll('.sub-zui')).forEach(subZui => {
        if (subZui !== el.parentElement) {
          subZui.style.display = 'none';
        }
      })
    }, 500, el);
  } else {
    zuiEl.style.transform = '';
  }
  el.style.display = 'none';
}

function zoomOut() {
  Array.from(zuiEl.querySelectorAll('.sub-zui')).forEach(el => {
    el.style.display = 'block';
    el.querySelector('iframe').classList.remove('parent');
    el.querySelector('.cover').style.display = 'block';
  });

  zuiEl.style.transform = transformStringCache;

  setTimeout(() => zuiEl.classList.remove('no-transition'), 10);
  setTimeout(() => zuiEl.style.transform = '', 20);
}

exports.zoomTo = zoomTo;
exports.zoomOut = zoomOut;

},{"./zuiEl":7}],7:[function(require,module,exports){
'use strict';

module.exports = document.querySelector('body > .zui');

},{}]},{},[1]);
