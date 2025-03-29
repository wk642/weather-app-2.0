import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import DisplayJokesData from './components/DisplayJokesData';
import DisplayWeatherData from './components/DisplayWeatherData';
import DisplayUsers from './components/DisplayUsers';
import Votes from './components/Votes';

export default function App() {
  // states 
  const [weatherData, setWeatherData] = useState(null);
  const [joke, setJoke] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cityInput, setCityInput] = useState('');
  const [cityHeader, setCityHeader] = useState('WEATHER');
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showVotes, setShowVotes] = useState(false);

  // votes
  const handleShowVotes = () => {
    setShowVotes(true);
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/users');
        const data = await response.json();
        setUsers(data);
        if (data.length > 0) {
          setCurrentUserId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // users
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

  // delte user
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
      await fetchUsers();
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // edit user
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
      await fetchUsers();
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // handle search
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
      setWeatherData(data);
      setCityHeader(`${city}'s Weather`);
      await handleGetJoke();
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
      setLoading(false);
    }
  };

  // handle changin name in the title
  const handleCityInputChange = (city) => {
    setCityInput(city);
    setCityHeader(`${city}'s Weather`);
    if (city === '') {
      setCityHeader('Weather');
    }
  };

  // weather images - maybe revisit this and use switch statments or another method instead
  const getWeatherImage = (description) => {
    if (description.includes('clear sky')) {
      return 'https://openweathermap.org/img/wn/01d@2x.png';
    } else if (description.includes('few clouds')) {
      return 'https://openweathermap.org/img/wn/02d@2x.png';
    } else if (description.includes('scattered clouds')) {
      return 'https://openweathermap.org/img/wn/03d@2x.png';
    } else if (description.includes('broken clouds')) {
      return 'https://openweathermap.org/img/wn/04d@2x.png';
    } else if (description.includes('overcast clouds')) {
      return 'https://openweathermap.org/img/wn/04d@2x.png';
    } else if (description.includes('rain')) {
      return 'https://openweathermap.org/img/wn/10d@2x.png';
    } else if (description.includes('snow')) {
      return 'https://openweathermap.org/img/wn/13d@2x.png';
    } else if (description.includes('thunderstorm')) {
      return 'https://openweathermap.org/img/wn/11d@2x.png';
    } else {
      return 'https://openweathermap.org/img/wn/50d@2x.png';
    }
  };

  // jokes
  const handleGetJoke = async () => {
    try {
      const response = await fetch('http://localhost:5000/joke');
      if (!response.ok) {
        throw new Error('Failed to fetch joke');
      }
      const data = await response.json();
      setJoke(data.joke);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setJoke(null);
      setLoading(false);
    }
  };

  // heart filled is favortied, not filled is not favorited.
  const handleMarkFavorite = async (city, userName, isAdding) => {
    if (!isAdding) {
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
      await fetchUsers();
      setFavoriteCities((prev) => [...prev, city]);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // get the user id so I don't need to hardcode any uder id
  const handleUserChange = (event) => {
    setCurrentUserId(event.target.value);
  };

  return (
    <div className="app-container">
      <h1>{cityHeader}</h1>
      <SearchBar handleWeatherSearch={handleWeatherSearch} handleCityInputChange={handleCityInputChange} />
      <div className="content-row">
        <div className="joke-column">
          {/* give a dropdown list of users for the voting */}
          <select onChange={handleUserChange} value={currentUserId}>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.user_name}
              </option>
            ))}
          </select>
          <br />
          <button onClick={handleShowVotes}>Show All Votes</button>
          
          <DisplayJokesData joke={joke} userId={currentUserId} />

          {showVotes && <Votes />}
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
          <DisplayUsers users={users} handleDeleteUser={handleDeleteUser} handleEditUser={handleEditUser} />
        </div>
      </div>
    </div>
  );
}
