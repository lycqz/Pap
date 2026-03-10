import { useState } from "react";
import { searchMovies, searchShows } from "../Utils/tmdb";

function SearchBar({ onGuess, mode }) {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (value) => {

    setQuery(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    let data = [];

    if (mode === "shows") {
      data = await searchShows(value);
    } else {
      data = await searchMovies(value);
    }

    setResults(data.slice(0, 5));

  };

  return (

    <div style={{ marginTop: "15px" }}>

      <input
        type="text"
        placeholder={
          mode === "shows"
            ? "Search for a TV show..."
            : "Search for a movie..."
        }
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        style={{
          padding: "8px",
          width: "90%",
          borderRadius: "6px",
          border: "none"
        }}
      />

      <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>

        {results.map((item) => {

          const title = item.title || item.name;
          const date = item.release_date || item.first_air_date;

          return (

            <li
              key={item.id}
              onClick={() => {

                onGuess(item);
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

              {item.poster_path && (

                <img
                  src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                  alt={title}
                  style={{
                    width: "50px",
                    borderRadius: "4px"
                  }}
                />

              )}

              <span>
                {title} ({date?.slice(0, 4)})
              </span>

            </li>

          );

        })}

      </ul>

    </div>

  );

}

export default SearchBar;
