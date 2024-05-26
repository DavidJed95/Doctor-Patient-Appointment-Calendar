import React, { useState } from 'react';
import InputField from './../form/InputField';
import Button from './../button/Button'

const SearchBar = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = event => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div>
      <input
        type={'text'}
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
