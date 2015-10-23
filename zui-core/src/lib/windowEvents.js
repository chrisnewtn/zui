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
