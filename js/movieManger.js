//hämta data från databasen
import * as Database from './dataBase.js';

async function addMovie(title, genre, releaseDate) {
    const movieData = {
        title,
        genre,
        releaseDate,
        watched: false,
        favorite: false,
        titleLower: title.toLowerCase()
    };

    try {
        await Database.addMovieToDB(movieData);
    } catch (error) {
        throw new Error("Error adding movie: " + error.message);
    }
}
//hämta movies från db 
async function fetchMovies() {
    try {
        return await Database.fetchMoviesFromDB();
    } catch (error) {
        throw new Error("Error fetching movies: " + error.message);
    }
}
//om man vill radera movie
async function deleteMovie(movieId) {
    try {
        await Database.deleteMovieFromDB(movieId);
    } catch (error) {
        throw new Error("Error deleting movie: " + error.message);
    }
}
//funktionen som toggle Watch elller ej
async function toggleWatched(movieId, currentStatus) {
    try {
        await Database.toggleWatchedInDB(movieId, currentStatus);
    } catch (error) {
        throw new Error("Error updating movie: " + error.message);
    }
}
//funktionen som toggle Favorit 
async function toggleFavorite(movieId, currentStatus) {
    try {
        await Database.toggleFavoriteInDB(movieId, currentStatus);
    } catch (error) {
        throw new Error("Error updating movie: " + error.message);
    }
}
//search funktionen 
async function searchMovie(searchTitle) {
    try {
        return await Database.searchMoviesInDB(searchTitle);
    } catch (error) {
        throw new Error("Error searching for movie: " + error.message);
    }
}
//display Favorites 
async function displayFavorites() {
    try {
        return await Database.fetchFavoritesFromDB();
    } catch (error) {
        throw new Error("Error fetching favorites: " + error.message);
    }
}
//exporta alla funktioner som man behöver 
export {
    addMovie,
    fetchMovies,
    deleteMovie,
    toggleWatched,
    toggleFavorite,
    searchMovie,
    displayFavorites,
   


};
//kolla om user har lagt samma title eller ej
export async function movieExists(title) {
    try {
        const movies = await fetchMovies(); 
        return movies.some(movie => movie.title.toLowerCase() === title.toLowerCase());
    } catch (error) {
        console.error( error);
        throw error; 
    }
}