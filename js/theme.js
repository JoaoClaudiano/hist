/**
 * Fortaleza Sub & Via — Theme Manager
 * Apply BEFORE body paints to prevent flash of wrong theme.
 * This file should be loaded synchronously from <head>.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'fsv-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  function getPreferred() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === DARK || stored === LIGHT) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Update theme-color meta if it exists
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === DARK ? '#1c1916' : '#18140c');
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || LIGHT;
    const next = current === DARK ? LIGHT : DARK;
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
    // Update all toggle buttons on page
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.setAttribute('aria-label', next === DARK ? 'Mudar para tema claro' : 'Mudar para tema escuro');
      btn.querySelector('.theme-icon').innerHTML = next === DARK
        ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
        : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    });
  }

  // Apply immediately on script load (prevents FOUC)
  applyTheme(getPreferred());

  // Expose globally
  window.FSVTheme = { toggle: toggleTheme, get: getPreferred };
})();
