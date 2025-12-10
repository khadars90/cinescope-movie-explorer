document.addEventListener('DOMContentLoaded', () => {
  loadPopularMovies();
});

async function loadPopularMovies() {
  const grid = document.getElementById('movies-grid');
  const errorBox = document.getElementById('error-box');
  if (!grid) return;

  grid.innerHTML = '<p class="loading">Loading popular movies...</p>';
  if (errorBox) errorBox.style.display = 'none';

  try {
    const data = await tmdbFetch('/movie/popular', { page: 1 });
    if (!data.results || data.results.length === 0) {
      grid.innerHTML = '<p class="empty-state">No movies found.</p>';
      return;
    }

    const html = data.results.map((movie) => createMovieCard(movie)).join('');
    grid.innerHTML = html;
  } catch (err) {
    console.error(err);
    if (errorBox) {
      errorBox.textContent = 'Something went wrong. Please try again later.';
      errorBox.style.display = 'block';
    }
    grid.innerHTML = '';
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
