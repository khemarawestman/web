// Import Firestore database
import { db } from './firebaseConfig.js';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    doc,
    deleteDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addMovieButton').addEventListener('click', addMovie);
    document.getElementById('searchMovieButton').addEventListener('click', searchMovie);
    document.getElementById('showFavoritesButton').addEventListener('click', displayFavorites);
    fetchMovies();
});

// samlar användarinmatning
async function addMovie() {
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

    // kolla om titel är samma eller ej
    const existingMovie = await checkIfMovieExists(title);
    if (existingMovie) {
        alert('This movie already exists in the database.');
        return;
    }

    const movieData = {
        title,
        genre,
        releaseDate,
        watched: false,
        favorite: false,
        titleLower: title.toLowerCase()
    };

    try {
        await addDoc(collection(db, 'movies'), movieData);
        fetchMovies();
        clearForm();
    } catch (error) {
        console.error("Error adding movie: ", error);
    }
}

// Rensar inmatningsfälten
function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('genre').value = '';
    document.getElementById('releaseDate').value = '';
}

// Hämtar alla filmer från Firestore-databasen
async function fetchMovies() {
    const moviesCollection = collection(db, 'movies');
    const snapshot = await getDocs(moviesCollection);
    const movies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    displayMovies(movies);
}

// visa movies på html 
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

//  En hjälpfunktion som skapar och returnerar en knappelement
function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    return button;
}

// Raderar en film från databasen baserat på det angivna film
async function deleteMovie(movieId) {
    try {
        await deleteDoc(doc(db, 'movies', movieId));
        fetchMovies();
    } catch (error) {
        console.error("Error deleting movie: ", error);
    }
}

// Uppdaterar 'tittad' status för en specifik film 
async function toggleWatched(movieId, currentStatus) {
    try {
        await updateDoc(doc(db, 'movies', movieId), { watched: !currentStatus });
        fetchMovies();
    } catch (error) {
        console.error("Error updating movie: ", error);
    }
}

//  Växlar 'favorit' statusen för en specifik film i databasen
async function toggleFavorite(movieId, currentStatus) {
    try {
        await updateDoc(doc(db, 'movies', movieId), { favorite: !currentStatus });
        fetchMovies();
    } catch (error) {
        console.error("Error updating movie: ", error);
    }
}

// Söker efter filmer baserat på titel
async function searchMovie() {
    const searchTitle = document.getElementById('searchTitle').value.trim();
    if (!searchTitle) {
        fetchMovies(); // Fetch all movies if search field is empty
        return;
    }

    const moviesCollection = collection(db, 'movies');
    const q = query(moviesCollection, where("title", "==", searchTitle));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        console.log("No matching movies found");
        return;
    }

    const movies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    displayMovies(movies);
}

// Filtrerar och visar endast de filmer som är markerade som favoriter
async function displayFavorites() {
    const moviesCollection = collection(db, 'movies');
    const q = query(moviesCollection, where("favorite", "==", true));
    const snapshot = await getDocs(q);
    const movies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    displayMovies(movies);
}

