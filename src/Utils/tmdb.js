import axios from "axios";

const API_KEY = "ba97aa338bf2bf969211ff265a9c7184";
const BASE_URL = "https://api.themoviedb.org/3";

/* ------------------------------------------------ */
/* AXIOS INSTANCE */
/* ------------------------------------------------ */

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY
  }
});

/* ------------------------------------------------ */
/* MOVIE SEARCH */
/* ------------------------------------------------ */

export async function searchMovies(query) {

  if (!query) return [];

  try {

    const res = await tmdb.get("/search/movie", {
      params: { query }
    });

    return res.data.results;

  } catch (err) {

    console.error("Movie search error:", err);
    return [];

  }

}

/* ------------------------------------------------ */
/* TV SHOW SEARCH */
/* ------------------------------------------------ */

export async function searchShows(query) {

  if (!query) return [];

  try {

    const res = await tmdb.get("/search/tv", {
      params: { query }
    });

    return res.data.results;

  } catch (err) {

    console.error("Show search error:", err);
    return [];

  }

}

/* ------------------------------------------------ */
/* MOVIE GENRES */
/* ------------------------------------------------ */

export async function getGenres() {

  try {

    const res = await tmdb.get("/genre/movie/list");

    return res.data.genres;

  } catch (err) {

    console.error("Movie genre fetch error:", err);
    return [];

  }

}

/* ------------------------------------------------ */
/* TV SHOW GENRES */
/* ------------------------------------------------ */

export async function getShowGenres() {

  try {

    const res = await tmdb.get("/genre/tv/list");

    return res.data.genres;

  } catch (err) {

    console.error("TV genre fetch error:", err);
    return [];

  }

}

/* ------------------------------------------------ */
/* RANDOM MOVIE */
/* ------------------------------------------------ */

export async function getRandomMovie() {

  try {

    const randomPage = Math.floor(Math.random() * 10) + 1;

    const res = await tmdb.get("/movie/popular", {
      params: { page: randomPage }
    });

    const movies = res.data.results;

    return movies[Math.floor(Math.random() * movies.length)];

  } catch (err) {

    console.error("Random movie error:", err);
    return null;

  }

}

/* ------------------------------------------------ */
/* RANDOM TV SHOW */
/* ------------------------------------------------ */

export async function getRandomShow() {

  try {

    const randomPage = Math.floor(Math.random() * 10) + 1;

    const res = await tmdb.get("/tv/popular", {
      params: { page: randomPage }
    });

    const shows = res.data.results;

    return shows[Math.floor(Math.random() * shows.length)];

  } catch (err) {

    console.error("Random show error:", err);
    return null;

  }

}

/* ------------------------------------------------ */
/* MOVIE CAST */
/* ------------------------------------------------ */

export async function getMovieCast(movieId) {

  try {

    const res = await tmdb.get(`/movie/${movieId}/credits`);

    return res.data.cast.slice(0, 5);

  } catch (err) {

    console.error("Cast fetch error:", err);
    return [];

  }

}

/* ------------------------------------------------ */
/* SHOW CAST */
/* ------------------------------------------------ */

export async function getShowCast(showId) {

  try {

    const res = await tmdb.get(`/tv/${showId}/credits`);

    return res.data.cast.slice(0, 5);

  } catch (err) {

    console.error("Show cast error:", err);
    return [];

  }

}

/* ------------------------------------------------ */
/* MOVIE TRAILER */
/* ------------------------------------------------ */

export async function getMovieTrailer(movieId) {

  try {

    const res = await tmdb.get(`/movie/${movieId}/videos`);

    const trailer = res.data.results.find(
      video => video.type === "Trailer"
    );

    return trailer ? trailer.key : null;

  } catch (err) {

    console.error("Trailer fetch error:", err);
    return null;

  }

}

/* ------------------------------------------------ */
/* SHOW TRAILER */
/* ------------------------------------------------ */

export async function getShowTrailer(showId) {

  try {

    const res = await tmdb.get(`/tv/${showId}/videos`);

    const trailer = res.data.results.find(
      video => video.type === "Trailer"
    );

    return trailer ? trailer.key : null;

  } catch (err) {

    console.error("Show trailer error:", err);
    return null;

  }

}

/* ------------------------------------------------ */
/* DAILY MOVIE */
/* ------------------------------------------------ */

export function getDailyMovie(movies) {

  if (!movies || movies.length === 0) return null;

  const today = new Date();

  const start = new Date(today.getFullYear(), 0, 0);

  const diff = today - start;

  const day = Math.floor(diff / (1000 * 60 * 60 * 24));

  return movies[day % movies.length];

}

/* ------------------------------------------------ */
/* DAILY SHOW */
/* ------------------------------------------------ */

export function getDailyShow(shows) {

  if (!shows || shows.length === 0) return null;

  const today = new Date();

  const start = new Date(today.getFullYear(), 0, 0);

  const diff = today - start;

  const day = Math.floor(diff / (1000 * 60 * 60 * 24));

  return shows[day % shows.length];

}
