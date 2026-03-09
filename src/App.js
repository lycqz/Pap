import translations from "./translations";
import { useState, useEffect } from "react";
import SearchBar from "./Components/SearchBar";
import { getRandomMovie, getGenres } from "./Utils/tmdb";
import "./App.css";
import iptaLogo from "./assets/ipta.png";

function App() {

  const [language, setLanguage] = useState("en");

  // Safe translation fallback
  const t = translations?.[language] ?? translations?.en ?? {};

  const [targetMovie, setTargetMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [guesses, setGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadMovie = async () => {
    try {
      setLoading(true);
      const movie = await getRandomMovie();
      setTargetMovie(movie);
      setGuesses(0);
      setGameOver(false);
    } catch (err) {
      console.error("Error loading movie", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovie();
    getGenres().then(setGenres).catch(console.error);
  }, []);

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

  if (loading) {
    return (
      <div className="app">
        <h2 style={{textAlign:"center", marginTop:"100px"}}>
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
          <img src={iptaLogo} alt="IPTA Logo" className="ipta-logo"/>
        </div>

        <div className="center">
          🎬 {t.title || "Guess The Movie"}
        </div>

        <div className="right">
          <button onClick={() => setShowSettings(!showSettings)}>
            ⚙ {t.settings}
          </button>
        </div>

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

      {/* GAME AREA */}
      {targetMovie && (

        <div className="movie-card">

          <img
            src={`https://image.tmdb.org/t/p/w500${targetMovie.poster_path}`}
            alt="poster"
            style={{ filter: `blur(${blurAmount}px)` }}
          />

          {/* MOVIE TITLE REVEAL */}
          {gameOver && (
            <h2 className="movie-reveal">
              🎬 {targetMovie.title}
            </h2>
          )}

          <div className="hints">

            <p>⭐ {t.rating}: {targetMovie.vote_average}</p>

            <p>📅 {t.year}: {targetMovie.release_date?.slice(0,4)}</p>

            <p>🎭 {t.genre}: {movieGenre}</p>

            <p>❓ {t.guesses}: {guesses} / 5</p>

          </div>

          {!gameOver && <SearchBar onGuess={handleGuess} />}

        </div>

      )}

      {gameOver && (
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
