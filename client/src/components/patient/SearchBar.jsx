import React, { useState } from "react";
// import InputField from "../common/InputField";
// import Button from "../common/Button";

const SearchBar = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  const searchBarSpacing = {
    margin: "2rem",
  };
  const searchBarInputWidth = { width: "24rem" };
  const searchBarButtonMargin = { marginLeft: ".1rem" };

  return (
    <div style={searchBarSpacing}>
      <input
        style={searchBarInputWidth}
        type={"search"}
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
      <button style={searchBarButtonMargin} onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
