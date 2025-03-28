import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import DsiplayJokesData from './components/DisplayJokesData';
import DisplayWeatherData from './components/DisplayWeatherData';
import DisplayUsers from './components/DisplayUsers';

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
  const [favoriteCities, setFavoriteCities] = useState([]);   

  // users
  useEffect(() => {
    fetchUsers(); 
  }, []);

  // fetching users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // handle delete user
  const handleDeleteUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      // fetch again for updated deleting 
      await fetchUsers(); 
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // handle edit user
  const handleEditUser = async (user) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      // fetch again for updated editing is saved 
      await fetchUsers(); 
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // handle weather search
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
      await handleGetJoke();
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

  // handle getting the image for the weather
  const getWeatherImage = (description) => {
    // Clear sky 01d
    if (description.includes("clear sky")) {
      return "https://openweathermap.org/img/wn/01d@2x.png"; 
    } // Few Cloud 02d
    else if (description.includes("few clouds")) {
      return "https://openweathermap.org/img/wn/02d@2x.png"; 
    } // Scattered Clouds 03d
    else if (description.includes("scattered clouds")) {
      return "https://openweathermap.org/img/wn/03d@2x.png"; 
    } // Broken Clouds 04d
    else if (description.includes("broken clouds")) {
      return "https://openweathermap.org/img/wn/04d@2x.png"; 
    } // Overcast Clouds 04d
    else if (description.includes("overcast clouds")) {
      return "https://openweathermap.org/img/wn/04d@2x.png"; 
    } // Rain
    else if (description.includes("rain")) {
      return "https://openweathermap.org/img/wn/10d@2x.png"; 
    } // Snow
    else if (description.includes("snow")) {
      return "https://openweathermap.org/img/wn/13d@2x.png"; 
    } // Thunderstorm
    else if (description.includes("thunderstorm")) {
      return "https://openweathermap.org/img/wn/11d@2x.png"; 
    } // Default image (mist) in case something doesn't match
    else {
      return "https://openweathermap.org/img/wn/50d@2x.png"; 
    }
  };

  // handle getting the joke
  const handleGetJoke = async () => {
    try {
      const response = await fetch('http://localhost:5000/joke');
      if (!response.ok) {
        throw new Error('Failed to fetch joke');
      }
      const data = await response.json();
      // console.log('Joke data from API:', data);
      setJoke(data.joke);
      // console.log('Making sure joke actually got set', data.joke);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setJoke(null);
      console.log('Error fetching joke:', err.message);
      setLoading(false);
    }
  };

  // hanndle favortie city
  const handleMarkFavorite = async (city, userName, isAdding) => { 
    if (!isAdding) {
      // Do nothing if unfavorited
      setFavoriteCities((prev) => prev.filter((favCity) => favCity !== city));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite_city: city, user_name: userName }),
      });
      if (!response.ok) {
        throw new Error('Failed to add favorite city and user');
      }
      // fetch again for updated adding 
      await fetchUsers();
      setFavoriteCities((prev) => [...prev, city]);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>{cityHeader}</h1>
      <SearchBar 
        handleWeatherSearch={handleWeatherSearch} 
        handleCityInputChange={handleCityInputChange}
      />
    
      <div className="content-row">
        <div className="joke-column">
          <DsiplayJokesData joke={joke} />
        </div>

        <div className="weather-column">
          <DisplayWeatherData 
            weatherData={weatherData} 
            getWeatherImage={getWeatherImage}
            handleMarkFavorite={handleMarkFavorite}
            isFavorite={favoriteCities.includes(weatherData?.name)}
          />
        </div>

        <div className="user-column">
          <DisplayUsers 
            users={users} 
            handleDeleteUser={handleDeleteUser}
            handleEditUser={handleEditUser}
          />    
        </div>
      </div>
    </div>
  );
}