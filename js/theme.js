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
      btn.querySelector('.theme-icon').textContent = next === DARK ? '☀️' : '🌙';
    });
  }

  // Apply immediately on script load (prevents FOUC)
  applyTheme(getPreferred());

  // Expose globally
  window.FSVTheme = { toggle: toggleTheme, get: getPreferred };
})();
