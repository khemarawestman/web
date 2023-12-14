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

export async function addMovieToDB(movieData) {
    await addDoc(collection(db, 'movies'), movieData);
}

export async function fetchMoviesFromDB() {
    const moviesCollection = collection(db, 'movies');
    const snapshot = await getDocs(moviesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function deleteMovieFromDB(movieId) {
    await deleteDoc(doc(db, 'movies', movieId));
}

export async function toggleWatchedInDB(movieId, currentStatus) {
    await updateDoc(doc(db, 'movies', movieId), { watched: !currentStatus });
}

export async function toggleFavoriteInDB(movieId, currentStatus) {
    await updateDoc(doc(db, 'movies', movieId), { favorite: !currentStatus });
}

export async function searchMoviesInDB(searchTitle) {
    const moviesCollection = collection(db, 'movies');
    const q = query(moviesCollection, where("title", "==", searchTitle));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchFavoritesFromDB() {
    const moviesCollection = collection(db, 'movies');
    const q = query(moviesCollection, where("favorite", "==", true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
