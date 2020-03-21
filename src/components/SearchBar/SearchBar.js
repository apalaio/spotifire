import React, { useEffect, useState } from "react";
import "./SearchBar.css";

const SearchBar = props => {
  //listens for enter key presses
  useEffect(() => {
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        search();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  });

  //gets the search term stored in session storage
  const initialTerm = () => {
    return String(window.sessionStorage.getItem("term") || ""); //WRAP IT IN A CUSTOM HOOK
  }; //sets state
  const [term, setTerm] = useState(initialTerm);

  //sets the session storage variable so that the search term is preserved between reloads
  useEffect(() => {
    window.sessionStorage.setItem("term", term);
  }, [term]);

  //search the spotify API for the term
  const search = () => {
    if (!term) {
      return;
    }
    props.onSearch(term);
  };

  return (
    <div className="SearchBar">
      <input
        placeholder="Enter A Song, Album, or Artist"
        onChange={e => setTerm(e.target.value)}
        value={term}
      />
      <button className="SearchButton" onClick={search}>
        SEARCH
      </button>
    </div>
  );
};

export default SearchBar;
