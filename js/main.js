// ===== Global Config =====
const TMDB_API_KEY = '5455ed16ded2104c2313d5e42c14cdb2';   // <-- put your key here
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMG_URL = 'https://image.tmdb.org/t/p/w500';

const THEME_KEY = 'cinescope_theme';
const WATCHLIST_KEY = 'cinescope_watchlist';
const FAVORITES_KEY = 'cinescope_favorites';

// ===== Theme Handling =====
function applyTheme(theme) {
  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add(theme);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'theme-dark';
  applyTheme(saved);

  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const current = document.body.classList.contains('theme-dark')
      ? 'theme-dark'
      : 'theme-light';
    const next = current === 'theme-dark' ? 'theme-light' : 'theme-dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}

// ===== Footer Year =====
function setYear() {
  const span = document.getElementById('year');
  if (span) {
    span.textContent = new Date().getFullYear();
  }
}

// ===== API Helper =====
async function tmdbFetch(path, params = {}) {
  const url = new URL(TMDB_BASE_URL + path);
  url.searchParams.set('api_key', TMDB_API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('TMDB error:', res.status, text);
    throw new Error('TMDB request failed: ' + res.status);
  }
  return res.json();
}

// ===== Storage Helpers =====
function getStoredList(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function saveStoredList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

function addToList(key, movie) {
  const list = getStoredList(key);
  const exists = list.some((item) => item.id === movie.id);
  if (!exists) {
    list.push(movie);
    saveStoredList(key, list);
    alert(
      `Added to ${
        key === WATCHLIST_KEY ? 'Watchlist' : 'Favorites'
      } ✅`
    );
  } else {
    alert('Already added ✅');
  }
}

// 🔹 NEW: check if a movie is in a list
function isInList(key, id) {
  const list = getStoredList(key);
  return list.some((item) => item.id === id);
}

// 🔹 NEW: remove a movie from a list
function removeFromList(key, id) {
  let list = getStoredList(key);
  list = list.filter((item) => item.id !== id);
  saveStoredList(key, list);
}

// ===== Init Common Stuff =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setYear();
});
