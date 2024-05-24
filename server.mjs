import express from "express"; // Import the express module
import axios from "axios"; // Import the axios module for making HTTP requests

const app = express(); // Create an instance of an Express application
const port = 3000; // Define the port number the server will listen on

app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data

app.use(express.static("public")); // Serve static files from the "public" directory

app.set("view engine", "ejs"); // Set EJS as the templating engine

// Route for the home page
app.get('/', (req, res) => {
    res.render('index'); // Render the index.ejs view when the root URL is accessed
});

// Route to handle form submission and fetch weather data
app.post('/weather', async (req, res) => {
    const location = req.body.location; // Get the location from the form submission
    const apiKey = '1faae782907f0b65e7862d658318c31e'; // Your OpenWeatherMap API key
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`; // URL to fetch the weather data

    try {
        // Make a GET request to the OpenWeatherMap API
        const response = await axios.get(url);
        const forecast = response.data; // Extract the data from the response
        const tomorrowForecast = forecast.list[8]; // Get the forecast for approximately 24 hours later
        const willRain = tomorrowForecast.weather.some(w => w.main.toLowerCase().includes('rain')); // Check if it will rain tomorrow

        // Render the result.ejs view with the weather data
        res.render('result', {
            location: forecast.city.name,
            willRain: willRain,
            description: tomorrowForecast.weather[0].description,
            temperature: tomorrowForecast.main.temp
        });
    } catch (error) {
        console.error(error); // Log the error to the console
        // Render the error.ejs view with an error message
        res.render('error', { message: 'Could not fetch weather data. Please try again.' });
    }
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`); 
});