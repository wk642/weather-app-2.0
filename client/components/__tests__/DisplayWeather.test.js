import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DisplayWeatherData from '../DisplayWeatherData';

// Mock data for getWeatherImage function
const mockGetWeatherImage = jest.fn((description) => `image-${description}.png`);

// Mock data for handleMarkFavorite function
const mockHandleMarkFavorite = jest.fn();

describe('DisplayWeatherData', () => {
  const mockWeatherData = {
    name: 'Test City',
    main: {
      temp: 70,
      feels_like: 72,
      humidity: 60,
    },
    weather: [{ description: 'clear sky' }],
    wind: { speed: 10 },
  };

  it('renders weather data', () => {
    render(
      <DisplayWeatherData
        weatherData={mockWeatherData}
        getWeatherImage={mockGetWeatherImage}
        handleMarkFavorite={mockHandleMarkFavorite}
        isFavorite={false}
      />
    );

    expect(screen.getByText('Temperature: 70 °F')).toBeInTheDocument();
    expect(screen.getByText('Feels Like: 72 °F')).toBeInTheDocument();
    expect(screen.getByText('Description: clear sky')).toBeInTheDocument();
    expect(screen.getByText('Humidity: 60%')).toBeInTheDocument();
    expect(screen.getByText('Wind Speed: 10 mph')).toBeInTheDocument();
    expect(mockGetWeatherImage).toHaveBeenCalledWith('clear sky');
    expect(screen.getByRole('img')).toHaveAttribute('src', 'image-clear sky.png');
  });
});