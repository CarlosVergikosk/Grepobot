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
  script.src =
    location.protocol +
    '//cdn.jsdelivr.net/gh/CarlosVergikosk/Grepobot@0.12/Autobot.js';
  link.href =
    location.protocol +
    '//cdn.jsdelivr.net/gh/CarlosVergikosk/Grepobot@0.12/Autobot.css';
  head.appendChild(script);
  head.appendChild(link);
  head.setAttribute('xhttps', 1);
})();
