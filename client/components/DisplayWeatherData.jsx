import React from 'react';

function DisplayWeatherData({ weatherData, getWeatherImage={getWeatherImage} }) {
  console.log('Weather data in DisplayWeatherData:', weatherData);

  if (!weatherData) {
    return null;
  }

  // learned about destructuring 
  // https://www.w3schools.com/js/js_destructuring.asp
  const { name, main, weather, wind } = weatherData;

  return (
    <div className="weather-data-container">
      <div className="weather-data-content">
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