import * as MovieManager from './movieManger.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addMovieButton').addEventListener('click', handleAddMovie);
    document.getElementById('searchMovieButton').addEventListener('click', handleSearchMovie);
    document.getElementById('showFavoritesButton').addEventListener('click', handleDisplayFavorites);
    refreshMovieList();
});

async function handleAddMovie() {
    const titleInput = document.getElementById('title');
    const genreInput = document.getElementById('genre');
    const releaseDateInput = document.getElementById('releaseDate');

    const title = titleInput.value.trim();
    const genre = genreInput.value.trim();
    const releaseDate = releaseDateInput.value;

    if (!title || !genre || !releaseDate) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const movieAlreadyExists = await MovieManager.movieExists(title);
        if (movieAlreadyExists) {
            alert('A movie with this title already exists.');
            return;
        }

        await MovieManager.addMovie(title, genre, releaseDate);
        refreshMovieList();
        clearForm();
    } catch (error) {
        console.error(error);
    }
}

export async function movieExists(title) {
    try {
        const movies = await fetchMoviesFromDB(); // Assuming this function fetches all movies
        return movies.some(movie => movie.title.toLowerCase() === title.toLowerCase());
    } catch (error) {
        console.error("Error checking if movie exists: ", error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}
function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('genre').value = '';
    document.getElementById('releaseDate').value = '';
}

async function refreshMovieList() {
    try {
        const movies = await MovieManager.fetchMovies();
        displayMovies(movies);
    } catch (error) {
        console.error(error);
    }
}

function displayMovies(movies) {
    const movieList = document.getElementById('movieList');
    movieList.innerHTML = '';

    movies.forEach(movie => {
        const movieItem = document.createElement('li');
        movieItem.textContent = `${movie.title} - ${movie.genre} - ${movie.releaseDate} - Watched: ${movie.watched} - Favorite: ${movie.favorite}`;

        const deleteBtn = createButton('Delete', () => handleDeleteMovie(movie.id));
        const watchedBtn = createButton(movie.watched ? 'Unmark Watched' : 'Mark Watched', () => handleToggleWatched(movie.id, movie.watched));
        const favoriteBtn = createButton(movie.favorite ? 'Unmark Favorite' : 'Mark Favorite', () => handleToggleFavorite(movie.id, movie.favorite));

        movieItem.append(deleteBtn, watchedBtn, favoriteBtn);
        movieList.appendChild(movieItem);
    });
}

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    return button;
}

async function handleDeleteMovie(movieId) {
    try {
        await MovieManager.deleteMovie(movieId);
        refreshMovieList();
    } catch (error) {
        console.error(error);
    }
}

async function handleToggleWatched(movieId, currentStatus) {
    try {
        await MovieManager.toggleWatched(movieId, currentStatus);
        refreshMovieList();
    } catch (error) {
        console.error(error);
    }
}

async function handleToggleFavorite(movieId, currentStatus) {
    try {
        await MovieManager.toggleFavorite(movieId, currentStatus);
        refreshMovieList();
    } catch (error) {
        console.error(error);
    }
}

async function handleSearchMovie() {
    const searchTitle = document.getElementById('searchTitle').value.trim();

    try {
        if (!searchTitle) {
            refreshMovieList();
            return;
        }

        const movies = await MovieManager.searchMovie(searchTitle);
        displayMovies(movies);
    } catch (error) {
        console.error(error);
    }
    
}

async function handleDisplayFavorites() {
    try {
        const movies = await MovieManager.displayFavorites();
        displayMovies(movies);
    } catch (error) {
        console.error(error);
    }
}
