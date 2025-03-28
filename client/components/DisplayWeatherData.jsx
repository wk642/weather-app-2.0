import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons';
import React, { useState, useEffect } from 'react';

export default function DisplayWeatherData({ weatherData, getWeatherImage, handleMarkFavorite, isFavorite }) {
  console.log('Weather data in DisplayWeatherData:', weatherData);

  const [favorite, setFavorite] = useState(isFavorite || false);

  useEffect(() => {
    setFavorite(isFavorite || false);
  }, [isFavorite]);

  if (!weatherData) {
    return null;
  }

  const { name, main, weather, wind } = weatherData;

  const handleFavoriteButton = () => { 
    handleMarkFavorite(name);
    setFavorite(!favorite);
  };

  return (
    <div className="weather-data-container">
      <div className="weather-data-content">
        <button className="favorite-button" onClick={handleFavoriteButton }>
          {favorite ? <HeartFilledIcon /> : <HeartIcon />}
        </button>
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