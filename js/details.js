document.addEventListener('DOMContentLoaded', () => {
  loadMovieDetails();
});

async function loadMovieDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const container = document.getElementById('movie-details');
  const errorBox = document.getElementById('error-box');

  if (!id || !container) {
    if (errorBox) {
      errorBox.textContent = 'No movie selected.';
      errorBox.style.display = 'block';
    }
    return;
  }

  container.innerHTML = '<p class="loading">Loading movie details...</p>';
  if (errorBox) {
    errorBox.style.display = 'none';
    errorBox.textContent = '';
  }

  try {
    const movie = await tmdbFetch(`/movie/${id}`);

    const imgUrl = movie.poster_path
      ? `${TMDB_IMG_URL}${movie.poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Image';

    const genres = movie.genres?.map((g) => g.name).join(', ') || 'N/A';

    container.innerHTML = `
      <div>
        <img src="${imgUrl}" alt="${movie.title}" />
      </div>
      <div>
        <h1>${movie.title}</h1>
        <p><strong>Rating:</strong> ${movie.vote_average || 'N/A'}</p>
        <p><strong>Release Date:</strong> ${movie.release_date || 'N/A'}</p>
        <p><strong>Genres:</strong> ${genres}</p>
        <p><strong>Overview:</strong> ${movie.overview || 'No overview available.'}</p>

        <div class="movie-actions">
          <button id="add-watchlist-btn" class="btn-outline">
            ➕ Add to Watchlist
          </button>
          <button id="add-favorites-btn" class="btn-primary">
            ❤️ Add to Favorites
          </button>
        </div>
      </div>
    `;

    initMovieActions(movie);
  } catch (err) {
    console.error('Details error:', err);
    container.innerHTML = '';
    if (errorBox) {
      errorBox.textContent = 'Failed to load movie details.';
      errorBox.style.display = 'block';
    }
  }
}

function initMovieActions(movie) {
  const watchlistBtn = document.getElementById('add-watchlist-btn');
  const favoritesBtn = document.getElementById('add-favorites-btn');

  if (!watchlistBtn || !favoritesBtn) return;

  const movieToStore = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
  };

  // ----- Watchlist toggle -----
  if (isInList(WATCHLIST_KEY, movie.id)) {
    watchlistBtn.textContent = '❌ Remove from Watchlist';
  } else {
    watchlistBtn.textContent = '➕ Add to Watchlist';
  }

  watchlistBtn.addEventListener('click', () => {
    const inWatchlist = isInList(WATCHLIST_KEY, movie.id);

    if (inWatchlist) {
      removeFromList(WATCHLIST_KEY, movie.id);
      watchlistBtn.textContent = '➕ Add to Watchlist';
      alert('Removed from Watchlist ❌');
    } else {
      addToList(WATCHLIST_KEY, movieToStore);
      watchlistBtn.textContent = '❌ Remove from Watchlist';
      // addToList already shows "Added" alert
    }
  });

  // ----- Favorites toggle -----
  if (isInList(FAVORITES_KEY, movie.id)) {
    favoritesBtn.textContent = '💔 Remove from Favorites';
  } else {
    favoritesBtn.textContent = '❤️ Add to Favorites';
  }

  favoritesBtn.addEventListener('click', () => {
    const inFavorites = isInList(FAVORITES_KEY, movie.id);

    if (inFavorites) {
      removeFromList(FAVORITES_KEY, movie.id);
      favoritesBtn.textContent = '❤️ Add to Favorites';
      alert('Removed from Favorites ❌');
    } else {
      addToList(FAVORITES_KEY, movieToStore);
      favoritesBtn.textContent = '💔 Remove from Favorites';
      // addToList already shows "Added" alert
    }
  });
}
