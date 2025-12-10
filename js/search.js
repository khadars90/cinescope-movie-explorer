document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');

  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    searchMovies(query);
  });
});

async function searchMovies(query) {
  const resultsContainer = document.getElementById('search-results');
  const errorBox = document.getElementById('error-box');

  if (!resultsContainer) return;

  resultsContainer.innerHTML = '<p class="loading">Searching...</p>';
  if (errorBox) {
    errorBox.style.display = 'none';
    errorBox.textContent = '';
  }

  try {
    const data = await tmdbFetch('/search/movie', { query });

    if (!data.results || data.results.length === 0) {
      resultsContainer.innerHTML = `<p class="empty-state">No results found for "${query}".</p>`;
      return;
    }

    const html = data.results.map((movie) => createMovieCard(movie)).join('');
    resultsContainer.innerHTML = html;
  } catch (err) {
    console.error(err);
    if (errorBox) {
      errorBox.textContent = 'Something went wrong. Please try again later.';
      errorBox.style.display = 'block';
    }
    resultsContainer.innerHTML = '';
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
