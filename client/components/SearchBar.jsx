import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react';

export default function SearchBar({ handleWeatherSearch, handleCityInputChange }) {
  const [city, setCity] = useState('');

  // getting the user's input
  const handleChange = (e) => {
    setCity(e.target.value);
    handleCityInputChange(e.target.value);
  };

  // submit
  const handleSubmit = (e) => {
    e.preventDefault(); 
    handleWeatherSearch(city, e); 
    setCity('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={handleChange}
      />
      <button type="submit"><MagnifyingGlassIcon /></button>
    </form>
  );
}