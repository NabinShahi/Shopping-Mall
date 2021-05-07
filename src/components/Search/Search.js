import React from "react";
import "./Search.css";
import SearchIcon from "@material-ui/icons/Search";

function Search({ placeholder, onChange }) {
  return (
    <form className="search">
      <input
        type="search"
        placeholder={placeholder}
        name="search"
        onChange={(event) => onChange(event)}
      />
      <button type="submit">
        <SearchIcon />
      </button>
    </form>
  );
}

export default Search;
