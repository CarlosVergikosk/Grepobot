// ==UserScript==
// @name			Namazu
// @autor			Carlos Vergikosk
// @version			1.0
// @include			http://*.grepolis.*/*
// @include			https://*.grepolis.*/*
// ==/UserScript==
(function () {
  var script = document.createElement('script'),
    link = document.createElement('link'),
    head = document.getElementsByTagName('head')[0];
  script.type = 'text/javascript';
  link.type = 'text/css';
  link.rel = 'stylesheet';
  console.log('  location.src', location.protocol);
  script.src =
    location.protocol +
    '//cdn.jsdelivr.net/gh/CarlosVergikosk/Grepobot@0.12/Autobot.js';
  console.log('  script.src', script.src);
  link.href =
    location.protocol +
    '//cdn.jsdelivr.net/gh/CarlosVergikosk/Grepobot@0.12/Autobot.css';
  console.log('href', link.href);
  head.appendChild(script);
  head.appendChild(link);
  head.setAttribute('xhttps', 1);
})();
