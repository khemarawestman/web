import * as MovieManager from './movieManger.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addMovieButton').addEventListener('click', AddMovie);
    document.getElementById('searchMovieButton').addEventListener('click', SearchMovie);
    document.getElementById('showFavoritesButton').addEventListener('click',displayFavorites);
    refreshMovieList();
});

async function AddMovie() {
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
        const movies = await fetchMoviesFromDB(); 
        return movies.some(movie => movie.title.toLowerCase() === title.toLowerCase());
    } catch (error) {
        console.error("Error checking if movie exists: ", error);
        throw error; 
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

        const deleteBtn = createButton('Delete', () => deleteMovie(movie.id));
        const watchedBtn = createButton(movie.watched ? 'Unmark Watched' : 'Mark Watched', () => toggleWatched(movie.id, movie.watched));
        const favoriteBtn = createButton(movie.favorite ? 'Unmark Favorite' : 'Mark Favorite', () => toggleFavorite(movie.id, movie.favorite));

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

async function deleteMovie(movieId) {
    try {
        await MovieManager.deleteMovie(movieId);
        refreshMovieList();
    } catch (error) {
        console.error(error);
    }
}

async function toggleWatched(movieId, currentStatus) {
    try {
        await MovieManager.toggleWatched(movieId, currentStatus);
        refreshMovieList();
    } catch (error) {
        console.error(error);
    }
}

async function toggleFavorite(movieId, currentStatus) {
    try {
        await MovieManager.toggleFavorite(movieId, currentStatus);
        refreshMovieList();
    } catch (error) {
        console.error(error);
    }
}

async function SearchMovie() {
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

async function displayFavorites() {
    try {
        const movies = await MovieManager.displayFavorites();
        displayMovies(movies);
    } catch (error) {
        console.error(error);
    }
}
