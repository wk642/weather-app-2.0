import React from 'react';

function DisplayWeatherData({ weatherData }) {
  console.log('Weather data in DisplayWeatherData:', weatherData);

  if (!weatherData) {
    return null;
  }

  const { name, main, weather, wind } = weatherData;

  return (
    <div className="weather-data">
      <h3>{name}</h3>
      {weather && weather[0] && (
        <>
          <p>Temperature: {main.temp} °F</p>
          <p>Feels Like: {main.feels_like} °F</p>
          <p>Description: {weather[0].description}</p>
          <p>Humidity: {main.humidity}%</p>
          {wind && <p>Wind Speed: {wind.speed} mph</p>}
        </>
      )}
    </div>
  );
}

export default DisplayWeatherData;