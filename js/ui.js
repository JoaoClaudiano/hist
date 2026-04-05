// js/ui.js — Scroll Reveal (once)
'use strict';
(function () {
  if (!('IntersectionObserver' in window)) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  function init() {
    document.querySelectorAll('.reveal:not(.revealed)').forEach(function (el) {
      observer.observe(el);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Public API: call window.FSVReveal.init() after dynamic DOM injection */
  window.FSVReveal = { init: init };
})();
