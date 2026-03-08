import { useState } from "react";
import { searchMovies } from "../Utils/tmdb";

function SearchBar({ onGuess }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (value) => {
    setQuery(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    const movies = await searchMovies(value);
    setResults(movies.slice(0, 5));
  };

  return (
    <div style={{marginTop:"15px"}}>

      <input
        type="text"
        placeholder="Search for a movie..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        style={{
          padding:"8px",
          width:"90%",
          borderRadius:"6px",
          border:"none"
        }}
      />

      <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
        {results.map((movie) => (
          <li
            key={movie.id}
            onClick={() => {
              onGuess(movie);
              setQuery("");
              setResults([]);
            }}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px",
              background: "#f4f4f4",
              borderRadius: "6px",
              marginBottom: "6px",
              color: "black"
            }}
          >

            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                alt={movie.title}
                style={{ width: "50px", borderRadius: "4px" }}
              />
            )}

            <span>
              {movie.title} ({movie.release_date?.slice(0, 4)})
            </span>

          </li>
        ))}
      </ul>

    </div>
  );
}

export default SearchBar;