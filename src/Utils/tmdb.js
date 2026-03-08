import axios from "axios";

const API_KEY = "ba97aa338bf2bf969211ff265a9c7184";
const BASE_URL = "https://api.themoviedb.org/3";

export async function searchMovies(query) {
  const res = await axios.get(`${BASE_URL}/search/movie`, {
    params: { api_key: API_KEY, query }
  });
  return res.data.results;
}

export async function getGenres() {
  const res = await axios.get(`${BASE_URL}/genre/movie/list`, {
    params: { api_key: API_KEY }
  });
  return res.data.genres;
}

export async function getRandomMovie() {
  const randomPage = Math.floor(Math.random() * 10) + 1;

  const res = await axios.get(`${BASE_URL}/movie/popular`, {
    params: { api_key: API_KEY, page: randomPage }
  });

  const movies = res.data.results;
  return movies[Math.floor(Math.random() * movies.length)];
}