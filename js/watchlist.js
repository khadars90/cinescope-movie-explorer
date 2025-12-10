document.addEventListener('DOMContentLoaded', () => {
  renderList(WATCHLIST_KEY, 'watchlist-grid');
  renderList(FAVORITES_KEY, 'favorites-grid');
});

function renderList(key, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const list = getStoredList(key);

  if (list.length === 0) {
    container.innerHTML = '<p class="empty-state">No items yet. Go add some!</p>';
    return;
  }

  const html = list.map((movie) => createMovieCard(movie, key)).join('');
  container.innerHTML = html;

  // Attach remove handlers
  const removeButtons = container.querySelectorAll('.remove-btn');
  removeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      removeFromList(key, id);
      renderList(key, containerId); // re-render after removal
    });
  });
}

function createMovieCard(movie, key) {
  const imgUrl = movie.poster_path
    ? `${TMDB_IMG_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const label = key === WATCHLIST_KEY ? 'Watchlist' : 'Favorites';

  return `
    <div class="card">
      <a href="movie-details.html?id=${movie.id}">
        <img src="${imgUrl}" alt="${movie.title}" />
      </a>
      <div class="card-body">
        <h3>${movie.title}</h3>
        <p>Rating: ${movie.vote_average || 'N/A'}</p>
        <button class="btn-outline remove-btn" data-id="${movie.id}">
          ❌ Remove from ${label}
        </button>
      </div>
    </div>
  `;
}
