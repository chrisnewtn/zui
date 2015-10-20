'use strict';

const zoomer = require('./zoomer');

function onMessage(e) {
  if (e.data && event.data.eventName === 'zoomOut') {
    zoomer.zoomOut();
  }
}

function listen() {
  window.addEventListener('message', onMessage, false);
}

exports.listen = listen;
