import { useState } from "react";

export interface Movies {
  id?: number;
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export default function App() {
  const [searchItem, setSearchItem] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [movies, setMovies] = useState<Movies[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<string[]>([]);
  // initialize the error state as empty string
  const [error, setError] = useState("");

  const api = "http://www.omdbapi.com/";
  const my_api_key = "c05820ad";

  /*Api is not supporting all the movies list */

  // useEffect(() => {
  //   const fetchMovies = async () => {
  //     //fetch(`${api}/?apikey=${my_api_key}&`)
  //     fetch("http://www.omdbapi.com/?plot=full&apikey=c05820ad&s=test&page=1")
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log("test", data);
  //         setMovies(data);
  //       });
  //   };

  //   fetchMovies();
  // }, []);

  const handleInputChange = (value: string) => {
    setSearchItem(value);
    getMovies(value);
  };

  const getMovies = (searchValue: string) => {
    const url = `${api}/?s=${searchValue}&apikey=${my_api_key}`;

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.Search) {
          setMovies(data.Search);
          setError("");

          // highlight text starts
          const escapedQuery = searchValue.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );
          const regex = new RegExp(escapedQuery, "gi");

          // Filter movies based on the query
          const results = data.Search.filter((entry: Movies) =>
            entry.Title.match(regex)
          );

          const highlightedTitle: string[] = [];

          // Display the results
          results.forEach((movie: Movies) => {
            // Highlight the search term in the result
            const hightText = movie.Title.replace(
              regex,
              (match) => `<b>${match}</b>`
            );
            highlightedTitle.push(hightText);
          });

          setFilteredMovies(highlightedTitle);

          // highlight text end
        }
      }) // if there's an error we log it to the console
      .catch((err) => {
        console.log(err);
        // update the error state
        setError(err);
      })
      .finally(() => {
        // wether we sucessfully get the users or not,
        // we update the loading state
        setLoading(false);
      });
  };

  return (
    <div className="movie_app">
      <h1 className="header">Future demand launches the movie app</h1>

      <form className="search">
        <input
          type="search"
          value={searchItem}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Type to search"
        />
      </form>

      <div className="movieContainer">
        {/* if the data is loading, show a proper message */}
        {loading && <div className="loader"></div>}
        {/* if there's an error, show a proper message */}
        {error && <p>There was an error loading the Movies</p>}
        {loading && !error && movies.length === 0 ? (
          <p>No Movies found</p>
        ) : (
          <>
            {filteredMovies.length > 0 && (
              <ul>
                {filteredMovies.map((title) => (
                  <li
                    key={title}
                    onClick={(e) => alert(`You selected ${title}!`)}
                  >
                    {title}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
