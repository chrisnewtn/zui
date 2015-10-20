'use strict';

const zuiEl = require('./lib/zuiEl');
const zoomer = require('./lib/zoomer');
const windowEvents = require('./lib/windowEvents');

function getZui(el) {
  if (el === null){
    return null;
  }
  if (el.classList.contains('cover')) {
    return el === zuiEl ? null : el;
  }
  return getZui(el.parentElement);
}

function onClick(e) {
  if (e.target.classList.contains('up')) {
    window.parent.postMessage('zoomOut', '*');
  }

  let el = getZui(e.target);

  if (el) {
    return zoomer.zoomTo(el);
  } else {
    zuiEl.style.transform = '';
  }
}

zuiEl.addEventListener('click', onClick);
windowEvents.listen();
