'use strict';

const zoomer = require('./zoomer');

function onMessage(e, zui) {
  if(!e.data || !event.data.eventName){
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
  if (eventName === 'setZoomLevel') {
    zui.setZoomLevel(event.data.data.level, event.source);
    return;
  }
}

function listen(zui) {
  window.addEventListener('message', e => onMessage(e, zui), false);
}

exports.listen = listen;
