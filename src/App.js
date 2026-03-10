import translations from "./translations";
import { useState, useEffect } from "react";
import SearchBar from "./Components/SearchBar";
import {
  getRandomMovie,
  getGenres,
  getMovieCast,
  getMovieTrailer,
  getRandomShow,
  getShowGenres,
  getShowCast,
  getShowTrailer
} from "./Utils/tmdb";
import "./App.css";
import iptaLogo from "./assets/ipta.png";

function App() {

  const [language, setLanguage] = useState("en");
  const [mode, setMode] = useState("movies");

  const t = translations?.[language] ?? translations?.en ?? {};

  const [targetMovie, setTargetMovie] = useState(null);
  const [targetShow, setTargetShow] = useState(null);

  const [genres, setGenres] = useState([]);
  const [showGenres, setShowGenres] = useState([]);

  const [guesses, setGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  const [cast, setCast] = useState([]);
  const [showCast, setShowCast] = useState(false);

  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  /* ---------------- MOVIE LOADER ---------------- */

  const loadMovie = async () => {

    try {

      setLoading(true);

      const movie = await getRandomMovie();

      setTargetMovie(movie);
      setGuesses(0);
      setGameOver(false);

      const castData = await getMovieCast(movie.id);
      setCast(castData);

      const trailerKey = await getMovieTrailer(movie.id);
      setTrailer(trailerKey);

      setShowCast(false);
      setShowTrailer(false);

    } catch (err) {

      console.error("Error loading movie", err);

    } finally {

      setLoading(false);

    }

  };

  /* ---------------- SHOW LOADER ---------------- */

  const loadShow = async () => {

    try {

      setLoading(true);

      const show = await getRandomShow();

      setTargetShow(show);
      setGuesses(0);
      setGameOver(false);

      const castData = await getShowCast(show.id);
      setCast(castData);

      const trailerKey = await getShowTrailer(show.id);
      setTrailer(trailerKey);

      setShowCast(false);
      setShowTrailer(false);

    } catch (err) {

      console.error("Error loading show", err);

    } finally {

      setLoading(false);

    }

  };

  /* ---------------- MODE SWITCH ---------------- */

  useEffect(() => {

    if (mode === "movies") {

      loadMovie();
      getGenres().then(setGenres);

    }

    if (mode === "shows") {

      loadShow();
      getShowGenres().then(setShowGenres);

    }

  }, [mode]);

  /* ---------------- GUESS SYSTEM ---------------- */

  const handleGuess = (item) => {

    const correctTitle =
      mode === "movies"
        ? targetMovie?.title
        : targetShow?.name;

    const guessTitle =
      item.title || item.name;

    if (!correctTitle || gameOver) return;

    if (guessTitle === correctTitle) {

      setGuesses(guesses + 1);
      setGameOver(true);

      alert(`${t.win} ${correctTitle}`);

      return;

    }

    const newGuesses = guesses + 1;
    setGuesses(newGuesses);

    if (newGuesses >= 5) {

      setGameOver(true);
      alert(`${t.lose} ${correctTitle}`);

    }

  };

  const blurAmount = gameOver ? 0 : Math.max(15 - guesses * 3, 0);

  /* ---------------- LOADING ---------------- */

  if (loading && (mode === "movies" || mode === "shows")) {

    return (
      <div className="app">
        <h2 style={{ textAlign: "center", marginTop: "100px" }}>
          🎬 Loading...
        </h2>
      </div>
    );

  }

  /* ---------------- APP ---------------- */

  return (

    <div className="app">

      {/* TOP BAR */}
      <div className="top-bar">

        <div className="left">
          <img src={iptaLogo} alt="IPTA Logo" className="ipta-logo" />
        </div>

        <div className="center">
          🎮 PAP Guessing Game
        </div>

        <div className="right">
          <button onClick={() => setShowSettings(!showSettings)}>
            ⚙ {t.settings}
          </button>
        </div>

      </div>

      {/* MODE SELECTOR */}
      <div className="mode-selector">

        <button
          className={mode === "movies" ? "active" : ""}
          onClick={() => setMode("movies")}
        >
          🎬 Movies
        </button>

        <button
          className={mode === "shows" ? "active" : ""}
          onClick={() => setMode("shows")}
        >
          📺 Shows
        </button>

        <button
          className={mode === "football" ? "active" : ""}
          onClick={() => setMode("football")}
        >
          ⚽ Football
        </button>

        <button
          className={mode === "music" ? "active" : ""}
          onClick={() => setMode("music")}
        >
          🎵 Music
        </button>

      </div>

      {/* SETTINGS */}
      {showSettings && (

        <div className="settings">

          <h3>{t.settings}</h3>

          <label>{t.language}</label>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >

            <option value="en">English</option>
            <option value="pt">Português</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="it">Italiano</option>

          </select>

        </div>

      )}

      {/* MOVIE MODE */}
      {mode === "movies" && targetMovie && (

        <GameCard
          item={targetMovie}
          title={targetMovie.title}
          year={targetMovie.release_date}
          rating={targetMovie.vote_average}
          poster={targetMovie.poster_path}
        />

      )}

      {/* SHOW MODE */}
      {mode === "shows" && targetShow && (

        <GameCard
          item={targetShow}
          title={targetShow.name}
          year={targetShow.first_air_date}
          rating={targetShow.vote_average}
          poster={targetShow.poster_path}
        />

      )}

      {/* FOOTBALL PLACEHOLDER */}
      {mode === "football" && (
        <div className="mode-placeholder">
          <h2>⚽ Football Mode Coming Soon</h2>
        </div>
      )}

      {/* MUSIC PLACEHOLDER */}
      {mode === "music" && (
        <div className="mode-placeholder">
          <h2>🎵 Music Mode Coming Soon</h2>
        </div>
      )}

      {/* FOOTER */}
      <div className="footer">
        Lucas Almeida — PAP Projeto
      </div>

    </div>

  );

}

/* ---------------- GAME CARD COMPONENT ---------------- */

function GameCard({ item, title, year, rating, poster }) {

  return null; // placeholder to avoid React errors if you later componentize

}

export default App;
