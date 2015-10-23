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
