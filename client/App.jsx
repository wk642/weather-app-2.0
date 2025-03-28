import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import DsiplayJokesData from './components/DisplayJokesData';
import DisplayWeatherData from './components/DisplayWeatherData';
import DisplayUsers from './components/DisplayUsers';
import WeatherCategorySearch from './components/WeatherCategorySearch';


export default function App() {
  // settinng the states
  const [weatherData, setWeatherData] = useState(null);
  const [joke, setJoke] = useState(null);
  const [users, setUsers] = useState([]);
  const [weatherCategoryUsers, setWeatherCategoryUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cityInput, setCityInput] = useState('');
  const [cityHeader, setCityHeader] = useState('WEATHER');  


  // // handle weather search
  const handleWeatherSearch = async (city, e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/weather/${city}`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather');
      }
      const data = await response.json();
      console.log('Weather data from API:', data);
      setWeatherData(data);
      console.log("Making sure the data is actually set ", data)
      setCityHeader(`${city}'s Weather`)
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
      console.log('Error fetching weather:', err.message);
      setLoading(false);
    }
  };

  // changing the city title
  const handleCityInputChange = (city) => {
    setCityInput(city);
    setCityHeader(`${city}'s Weather`);
    if (city === ''){
      setCityHeader('Weather');
    }
  };

  // handle getting the joke
  const handleGetJoke = async () => {
    try {
      const response = await fetch(`http://localhost:5000/weather/${city}`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather');
      }
      const data = await response.json();
      setWeatherData(data);
      if (data && data.weather && data.weather[0]) {
        await handleGetJoke();
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
      setCityHeader('WEATHER');
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>{cityHeader}</h1>
      <SearchBar hanndleWeatherSearch={handleWeatherSearch} handleCityInputChange={handleCityInputChange}/>
    
      <div className="content-row">
        <div className="joke-column">
          <DsiplayJokesData joke={joke} onGetJoke={handleGetJoke} />
        </div>

        <div className="weather-column">
          <DisplayWeatherData weatherData={weatherData} />
        </div>

        <div className="user-column">
          <DisplayUsers />
          <WeatherCategorySearch />
        </div>
      </div>
    </div>
  );
}