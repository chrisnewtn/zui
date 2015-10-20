'use strict';

var zuiEl = document.querySelector('body > .zui');

function getZui(el) {
  if (el === null){
    return null;
  }
  if (el.classList.contains('cover')) {
    return el === zuiEl ? null : el;
  }
  return getZui(el.parentElement);
}

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

var transformStringCache;

function zoomToZui(el) {
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

function onClick(e) {
  if (e.target.classList.contains('up')) {
    window.parent.postMessage('zoomOut', '*');
  }

  let el = getZui(e.target);

  if (el) {
    return zoomToZui(el);
  } else {
    zuiEl.style.transform = '';
  }
}

function onMessage(e) {
  if (e.data === 'zoomOut') {
    zoomOut();
  }
}

zuiEl.addEventListener('click', onClick);
window.addEventListener('message', onMessage, false);
