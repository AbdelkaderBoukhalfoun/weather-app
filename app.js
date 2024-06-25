import CONFIG from './config.js';

const apiKey = CONFIG.API_KEY;
const apiURL = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';

// DOM Elements
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const weatherContainer = document.querySelector(".weather");
const errorContainer = document.querySelector(".error");

// Function to update the weather icon
function updateWeatherIcon(weatherCondition) {
    const condition = weatherCondition.toLowerCase();
    const iconMap = {
        'clouds': "images/clouds.png",
        'clear': "images/clear.png",
        'rain': "images/rain.png",
        'drizzle': "images/drizzle.png",
        'mist': "images/mist.png"
    };
    weatherIcon.src = iconMap[condition] || `https://openweathermap.org/img/wn/${weatherCondition.icon}.png`;
}

// Function to display weather data
function displayWeatherData(data) {
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
    document.querySelector(".wind").textContent = `${data.wind.speed} km/h`;
    updateWeatherIcon(data.weather[0].main);

    errorContainer.style.display = "none";
    weatherContainer.style.display = "block";
}

// Function to display error messages
function displayErrorMessage(message) {
    errorContainer.textContent = message;
    errorContainer.style.display = "block";
    weatherContainer.style.display = "none";
}

// Function to fetch weather data
async function fetchWeatherData(city) {
    try {
        const response = await fetch(`${apiURL}${city}&appid=${apiKey}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                displayErrorMessage("City not found");
            } else {
                throw new Error('Weather data not available');
            }
        } else {
            const data = await response.json();
            displayWeatherData(data);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        displayErrorMessage("Error fetching weather data");
    }
}

// Function to handle search
function handleSearch() {
    const city = searchBox.value.trim();
    if (city) {
        fetchWeatherData(city);
    }
}

// Event listener for search button click
searchBtn.addEventListener("click", handleSearch);

// Event listener for Enter key press in input field
searchBox.addEventListener("keypress", (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});
