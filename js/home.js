document.addEventListener('DOMContentLoaded', () => {
  loadTrending();
});

async function loadTrending() {
  const grid = document.getElementById('trending-grid');
  if (!grid) return;

  grid.innerHTML = '<p class="loading">Loading trending movies...</p>';

  try {
    const data = await tmdbFetch('/trending/movie/day');
    if (!data.results || data.results.length === 0) {
      grid.innerHTML = '<p class="empty-state">No trending movies found.</p>';
      return;
    }

    const html = data.results.slice(0, 10).map((movie) => createMovieCard(movie)).join('');
    grid.innerHTML = html;
  } catch (err) {
    console.error(err);
    grid.innerHTML = '<p class="empty-state">Failed to load trending movies.</p>';
  }
}

function createMovieCard(movie) {
  const imgUrl = movie.poster_path
    ? `${TMDB_IMG_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return `
    <a href="movie-details.html?id=${movie.id}" class="card">
      <img src="${imgUrl}" alt="${movie.title}" />
      <div class="card-body">
        <h3>${movie.title}</h3>
        <p>Rating: ${movie.vote_average || 'N/A'}</p>
      </div>
    </a>
  `;
}
