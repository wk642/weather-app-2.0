import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons';
import React, { useState, useEffect } from 'react';

function DisplayWeatherData({ weatherData, getWeatherImage, handleMarkFavorite, isFavorite }) {
  const [favorite, setFavorite] = useState(isFavorite || false);
  const [userName, setUserName] = useState('');
  const [nameInputVisible, setNameInputVisible] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite || false);
  }, [isFavorite]);

  if (!weatherData) {
    return null;
  }

  const { name, main, weather, wind } = weatherData;

  const handleFavoriteClick = () => {
    if (!favorite) {
      // If adding as favorite, show name input
      setNameInputVisible(true);
    } else {
      // If removing, just call handleMarkFavorite
      handleMarkFavorite(name, userName);
      setFavorite(false);
    }
  };

  const handleSubmitFavorite = () => {
    handleMarkFavorite(name, userName);
    setFavorite(true);
    setNameInputVisible(false);
    setUserName(''); // Clear the input
  };

  return (
    <div className="weather-data-container">
      <div className="weather-data-content">
        <button className="favorite-button" onClick={handleFavoriteClick}>
          {favorite ? <HeartFilledIcon /> : <HeartIcon />}
        </button>
        {nameInputVisible && (
          <div className="name-input-container">
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <button onClick={handleSubmitFavorite}>Submit</button>
          </div>
        )}
        {weather && weather[0] && (
          <>
            <img src={getWeatherImage(weather[0].description)} alt={weather[0].description} />
            <p>Temperature: {main.temp} °F</p>
            <p>Feels Like: {main.feels_like} °F</p>
            <p>Description: {weather[0].description}</p>
            <p>Humidity: {main.humidity}%</p>
            {wind && <p>Wind Speed: {wind.speed} mph</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default DisplayWeatherData;