// Firebase imports
import app from './firebaseConfig.js';
import { getDatabase, ref, set, remove, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addMovieButton').addEventListener('click', addMovie);
    document.getElementById('searchMovieButton').addEventListener('click', searchMovie);
    document.getElementById('showFavoritesButton').addEventListener('click', displayFavorites);
    fetchMovies();
});

function addMovie() {
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

    const movieData = {
        title,
        genre,
        releaseDate,
        watched: false,
        favorite: false
    };

    set(ref(database, 'movies/' + title), movieData).then(() => {
        fetchMovies();
        clearForm();
    }).catch((error) => {
        console.error("Error adding movie: ", error);
    });
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('genre').value = '';
    document.getElementById('releaseDate').value = '';
}

function searchMovie() {
    const searchTitle = document.getElementById('searchTitle').value.trim().toLowerCase();

    const moviesRef = ref(database, 'movies');
    onValue(moviesRef, (snapshot) => {
        const movies = snapshot.val();
        const filteredMovies = Object.keys(movies).filter(key => movies[key].title.toLowerCase().includes(searchTitle)).reduce((obj, key) => {
            obj[key] = movies[key];
            return obj;
        }, {});

        displayMovies(filteredMovies);
    });
}

function displayFavorites() {
    const moviesRef = ref(database, 'movies');
    onValue(moviesRef, (snapshot) => {
        const movies = snapshot.val();
        const favoriteMovies = Object.keys(movies).filter(key => movies[key].favorite).reduce((obj, key) => {
            obj[key] = movies[key];
            return obj;
        }, {});

        displayMovies(favoriteMovies);
    });
}

function fetchMovies() {
    const moviesRef = ref(database, 'movies');
    onValue(moviesRef, (snapshot) => {
        displayMovies(snapshot.val());
    });
}

function displayMovies(movies) {
    const movieList = document.getElementById('movieList');
    movieList.innerHTML = '';

    for (const key in movies) {
        const movie = movies[key];
        const movieItem = document.createElement('li');
        movieItem.textContent = `${movie.title} - ${movie.genre} - ${movie.releaseDate} - Watched: ${movie.watched} - Favorite: ${movie.favorite}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteMovie(key);
        movieItem.appendChild(deleteBtn);

        const watchedBtn = document.createElement('button');
        watchedBtn.textContent = movie.watched ? 'Unmark Watched' : 'Mark Watched';
        watchedBtn.onclick = () => watchedStatus(key, movie.watched);
        movieItem.appendChild(watchedBtn);

        const favoriteBtn = document.createElement('button');
        favoriteBtn.textContent = movie.favorite ? 'Unmark Favorite' : 'Mark Favorite';
        favoriteBtn.onclick = () => FavoriteStatus(key, movie.favorite);
        movieItem.appendChild(favoriteBtn);

        movieList.appendChild(movieItem);
    }
}

function deleteMovie(movieId) {
    remove(ref(database, 'movies/' + movieId)).then(() => {
        fetchMovies();
    }).catch((error) => {
        console.error("Error deleting movie: ", error);
    });
}

function watchedStatus(movieId, currentStatus) {
    update(ref(database, 'movies/' + movieId), { watched: !currentStatus }).then(() => {
        fetchMovies();
    }).catch((error) => {
        console.error("Error updating movie: ", error);
    });
}

function FavoriteStatus(movieId, currentStatus) {
    update(ref(database, 'movies/' + movieId), { favorite: !currentStatus }).then(() => {
        fetchMovies();
    }).catch((error) => {
        console.error("Error updating movie: ", error);
    });
}
