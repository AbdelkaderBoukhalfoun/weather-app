import CONFIG from './config.js';

const apiKey = CONFIG.API_KEY;
const apiURL = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const weatherContainer = document.querySelector(".weather");
const errorContainer = document.querySelector(".error");

// Function to fetch weather data and update HTML
async function checkWeather(city) {
    try {
        const response = await fetch(`${apiURL}${city}&appid=${apiKey}`);

        if (!response.ok) {
            if (response.status === 404) {
                // City not found
                errorContainer.textContent = "City not found";
                errorContainer.style.display = "block";
                weatherContainer.style.display = "none";
            } else {
                throw new Error('Weather data not available');
            }
        } else {
            // City found, hide error message
            errorContainer.style.display = "none";
            weatherContainer.style.display = "block";

            const data = await response.json(); // Parse JSON response into data object

            // Update HTML elements with weather data
            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = `${Math.round(data.main.temp)}°C`; // Corrected temperature formatting
            document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
            document.querySelector(".wind").textContent = `${data.wind.speed} km/h`;

            // Update weather icon based on weather conditions
            switch (data.weather[0].main.toLowerCase()) {
                case 'clouds':
                    weatherIcon.src = "images/clouds.png";
                    break;
                case 'clear':
                    weatherIcon.src = "images/clear.png";
                    break;
                case 'rain':
                    weatherIcon.src = "images/rain.png";
                    break;
                case 'drizzle':
                    weatherIcon.src = "images/drizzle.png";
                    break;
                case 'mist':
                    weatherIcon.src = "images/mist.png";
                    break;
                default:
                    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
                    break;
            }

            // Log the entire data object for debugging
            console.log(data);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        errorContainer.textContent = "Error fetching weather data";
        errorContainer.style.display = "block";
        weatherContainer.style.display = "none";
    }
}

// Event listener for search button click
searchBtn.addEventListener("click", () => {
    const city = searchBox.value.trim();
    if (city) {
        checkWeather(city);
    }
});

// Event listener for Enter key press in input field
searchBox.addEventListener("keypress", (event) => {
    if (event.key === 'Enter') {
        const city = searchBox.value.trim();
        if (city) {
            checkWeather(city);
        }
    }
});
