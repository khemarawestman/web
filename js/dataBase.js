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
//exporta addmovie funktionen till moviemagner
export async function addMovieToDB(movieData) {
    await addDoc(collection(db, 'movies'), movieData);
}
//exporta movies  funktionen till moviemagner
export async function fetchMoviesFromDB() {
    const moviesCollection = collection(db, 'movies');
    const snapshot = await getDocs(moviesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
//exporta delete från db  funktionen till moviemagner
export async function deleteMovieFromDB(movieId) {
    await deleteDoc(doc(db, 'movies', movieId));
}
//exporta togglewached  från db  funktionen till moviemagner
export async function toggleWatchedInDB(movieId, currentStatus) {
    await updateDoc(doc(db, 'movies', movieId), { watched: !currentStatus });
}
//exporta favorit  från db  funktionen till moviemagner
export async function toggleFavoriteInDB(movieId, currentStatus) {
    await updateDoc(doc(db, 'movies', movieId), { favorite: !currentStatus });
}
//exporta searchInDb från db  funktionen till moviemagner
export async function searchMoviesInDB(searchTitle) {
    const moviesCollection = collection(db, 'movies');
    const q = query(moviesCollection, where("title", "==", searchTitle));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
//exporta favorites från db  funktionen till moviemagner
export async function fetchFavoritesFromDB() {
    const moviesCollection = collection(db, 'movies');
    const q = query(moviesCollection, where("favorite", "==", true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
