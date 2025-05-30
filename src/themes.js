// src/themes.js
let currentTheme = 'dark';

export function getTheme() {
  return currentTheme;
}

export function setTheme(theme) {
  currentTheme = theme;
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}

export function loadSavedTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  setTheme(saved);
}
