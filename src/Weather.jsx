import React, { useState, useEffect } from "react";
import "./Weather.css";

const api = {
  key: "ead18479b51f1bf9974667b0aa5e0674",
  base: "https://api.openweathermap.org/data/2.5/",
};

const Weather = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const url = `${api.base}weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api.key}`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        setWeather(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the weather data', error);
        setLoading(false);
      }
    });
  }, []);

  const search = (e) => {
    if (e.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&appid=${api.key}`)
        .then((res) => res.json())
        .then((data) => {
          setWeather(data);
          setQuery("");
        });
    }
  };

  const dateBuilder = (d) => {
    let days = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    let months = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    return `${day}, ${date} ${month} ${year}`;
  };

  const weatherclass = (w) => {
    let wclass = "";
    switch (w.toLowerCase()) {
      case "clouds":
        wclass = "clouds";
        break;
      case "clear":
        wclass = "clear";
        break;
      case "haze":
        wclass = "haze";
        break;
      case "dust":
        wclass = "dust";
        break;
      case "thunderstorm":
        wclass = "thunderstorm";
        break;
      case "rain":
      case "drizzle":
        wclass = "rain";
        break;
      default:
        wclass = "clear";
    }
    return wclass;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={typeof weather.main != "undefined" ? weatherclass(weather.weather[0].main) : "clear"}>
      <main>
        <div className="search-box">
          <input
            className="search-bar"
            type="text"
            placeholder="Enter city name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={search}
          />
        </div>
        {weather.main ? (
          <div>
            <div className="location-box">
              <div className="location">{weather.name}, {weather.sys && weather.sys.country}</div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              <div className="temp">{Math.round(weather.main.temp)}°C</div>
              <div className="weather">{weather.weather[0].description}</div>
              <div className="details">
                <p>Min Temperature: {weather.main.temp_min}°C</p>
                <p>Max Temperature: {weather.main.temp_max}°C</p>
                <p>Humidity: {weather.main.humidity}%</p>
                <p>Wind Speed: {weather.wind.speed} m/s</p>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </main>
    </div>
  );
};

export default Weather;
