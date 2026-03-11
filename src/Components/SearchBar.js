import { useState } from "react";
<<<<<<< HEAD
import { searchMovies, searchShows } from "../Utils/tmdb";

function SearchBar({ onGuess, mode }) {
=======
import { searchMovies } from "../Utils/tmdb";
import translations from "../translations";

function SearchBar({ onGuess, language }) {
>>>>>>> a9327b8 (final fixes)

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (value) => {

    setQuery(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

<<<<<<< HEAD
    let data = [];

    if (mode === "shows") {
      data = await searchShows(value);
    } else {
      data = await searchMovies(value);
    }

    setResults(data.slice(0, 5));

=======
    try {

      const movies = await searchMovies(value, language);

      setResults(movies.slice(0,5));

    } catch(err){

      console.error("Search error:", err);

    }

>>>>>>> a9327b8 (final fixes)
  };

  const t = translations?.[language] || translations.en;

  return (

<<<<<<< HEAD
    <div style={{ marginTop: "15px" }}>

      <input
        type="text"
        placeholder={
          mode === "shows"
            ? "Search for a TV show..."
            : "Search for a movie..."
        }
=======
    <div style={{marginTop:"15px"}}>

      <input
        type="text"
        placeholder={t.search}
>>>>>>> a9327b8 (final fixes)
        value={query}
        onChange={(e)=>handleSearch(e.target.value)}
        style={{
          padding: "8px",
          width: "90%",
          borderRadius: "6px",
          border: "none"
        }}
      />

<<<<<<< HEAD
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

=======
      <ul style={{listStyle:"none", padding:0, marginTop:"10px"}}>

        {results.map(movie => (

          <li
            key={movie.id}
            onClick={()=>{

              onGuess(movie);
              setQuery("");
              setResults([]);

            }}
            style={{
              cursor:"pointer",
              display:"flex",
              alignItems:"center",
              gap:"10px",
              padding:"8px",
              background:"#f4f4f4",
              borderRadius:"6px",
              marginBottom:"6px",
              color:"black"
            }}
          >

            {movie.poster_path && (

              <img
                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                alt={movie.title}
                style={{width:"50px", borderRadius:"4px"}}
              />

            )}

            <span>
              {movie.title} ({movie.release_date?.slice(0,4)})
            </span>

          </li>

        ))}

>>>>>>> a9327b8 (final fixes)
      </ul>

    </div>

  );

}

export default SearchBar;
