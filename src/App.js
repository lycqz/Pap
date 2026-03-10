import translations from "./translations";
import { useState, useEffect } from "react";
import SearchBar from "./Components/SearchBar";
import {
  getRandomMovie,
  getGenres,
  getMovieCast,
  getMovieTrailer
} from "./Utils/tmdb";
import "./App.css";
import iptaLogo from "./assets/ipta.png";

function App() {

  const [language, setLanguage] = useState("en");
  const [mode, setMode] = useState("movies");

  const t = translations?.[language] ?? translations?.en ?? {};

  const [targetMovie, setTargetMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [guesses, setGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  const [cast, setCast] = useState([]);
  const [showCast, setShowCast] = useState(false);

  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

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

  useEffect(() => {

    if (mode === "movies") {
      loadMovie();
      getGenres().then(setGenres).catch(console.error);
    }

  }, [mode]);

  const handleGuess = (movie) => {

    if (!targetMovie || gameOver) return;

    if (movie.title === targetMovie.title) {

      setGuesses(guesses + 1);
      setGameOver(true);

      alert(`${t.win} ${targetMovie.title}`);

      return;

    }

    const newGuesses = guesses + 1;

    setGuesses(newGuesses);

    if (newGuesses >= 5) {

      setGameOver(true);

      alert(`${t.lose} ${targetMovie.title}`);

    }

  };

  const blurAmount = gameOver ? 0 : Math.max(15 - guesses * 3, 0);

  const movieGenre =
    genres.find(g => g.id === targetMovie?.genre_ids?.[0])?.name || "Unknown";

  if (loading && mode === "movies") {

    return (
      <div className="app">
        <h2 style={{ textAlign: "center", marginTop: "100px" }}>
          🎬 Loading movie...
        </h2>
      </div>
    );

  }

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

      {/* MOVIE GAME */}

      {mode === "movies" && targetMovie && (

        <div className="movie-card">

          <img
            src={`https://image.tmdb.org/t/p/w500${targetMovie.poster_path}`}
            alt="poster"
            style={{ filter: `blur(${blurAmount}px)` }}
          />

          {gameOver && (
            <h2 className="movie-reveal">
              🎬 {targetMovie.title}
            </h2>
          )}

          <div className="hints">

            <p>⭐ {t.rating}: {targetMovie.vote_average}</p>

            <p>📅 {t.year}: {targetMovie.release_date?.slice(0, 4)}</p>

            <p>🎭 {t.genre}: {movieGenre}</p>

            <p>❓ {t.guesses}: {guesses} / 5</p>

          </div>

          {/* HINT BUTTONS */}

          {!gameOver && (
            <div className="hint-buttons">

              <button onClick={() => setShowCast(true)}>
                🎭 Reveal Cast
              </button>

              <button onClick={() => setShowTrailer(true)}>
                🎬 Reveal Trailer
              </button>

            </div>
          )}

          {/* CAST HINT */}

          {showCast && (
            <div className="cast">
              <h3>🎭 Cast</h3>
              {cast.map(actor => (
                <p key={actor.id}>{actor.name}</p>
              ))}
            </div>
          )}

          {/* TRAILER HINT */}

          {showTrailer && trailer && (
            <iframe
              width="320"
              height="180"
              src={`https://www.youtube.com/embed/${trailer}`}
              title="Trailer"
              allowFullScreen
            />
          )}

          {!gameOver && (
            <SearchBar onGuess={handleGuess} />
          )}

        </div>

      )}

      {/* SHOWS PLACEHOLDER */}

      {mode === "shows" && (
        <div className="mode-placeholder">
          <h2>📺 Shows Mode Coming Soon</h2>
        </div>
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

      {/* PLAY AGAIN */}

      {gameOver && mode === "movies" && (

        <button onClick={loadMovie} className="play-again">
          🔄 {t.playAgain}
        </button>

      )}

      {/* FOOTER */}

      <div className="footer">
        Lucas Almeida — PAP Projeto
      </div>

    </div>

  );

}

export default App;
