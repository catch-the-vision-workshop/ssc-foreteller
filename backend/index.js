// Importing necessary modules
const express = require("express");
const cors = require("cors");

// Initialize an Express application
const app = express();

// Set the port for the server to listen on
const port = 3000;

// Apply CORS (Cross-Origin Resource Sharing) to allow requests from different domains
app.use(cors());

// Route for the root path
app.get("/", (req, res) => {
	// Send a simple text response
	res.send("Hello From the Backend Guys!");
});

// Route to get weather forecast data
app.get("/getForecast", async (req, res) => {
	// Extract cityName from query parameters
	const cityName = req.query.cityName;

	// Check if cityName is provided, send an error response if not
	if (!cityName) {
		res.status(400).json({ error: "Missing required parameter 'cityName'" });
		return;
	}

	// Fetch data from the weather API
	// Documentation: https://www.weatherapi.com/docs/
	// Explorer: https://www.weatherapi.com/api-explorer.aspx#forecast
	const weatherAPIUrl = `http://api.weatherapi.com/v1/forecast.json?key=d7e1b78d9b70431c8a5141651230212&q=${cityName}&days=1&aqi=no&alerts=no`;

	try {
		const result = await fetch(weatherAPIUrl);
		const data = await result.json();

		// Determine text color based on temperature
		let textColor;
		if (data.current.temp_c < 0) {
			textColor = "cyan";
		} else if (data.current.temp_c < 15) {
			textColor = "blue";
		} else if (data.current.temp_c < 30) {
			textColor = "orange";
		} else {
			textColor = "red";
		}

		// Calculate moisture level, divide by 10
		const moistLevel = data.current.humidity / 10;

		// Calculate average, max, and min temperature
		const forecastDay = data.forecast.forecastday[0];
		const hours = forecastDay.hour;

		let sumTemp = 0;
		let maxTemp = -Infinity;
		let minTemp = Infinity;

		for (let i = 0; i < hours.length; i++) {
			const temp = hours[i].temp_c; // Assuming we're using Celsius
			sumTemp += temp;

			if (temp > maxTemp) {
				maxTemp = temp;
			}

			if (temp < minTemp) {
				minTemp = temp;
			}
		}

		const averageTemp = sumTemp / hours.length;

		// Find the maximum UV index
		let maxUVIndex = 0;
		let maxUVTime = "";

		for (let i = 0; i < hours.length; i++) {
			const uvIndex = hours[i].uv;
			const time = hours[i].time;

			if (uvIndex > maxUVIndex) {
				maxUVIndex = uvIndex;
				maxUVTime = time;
			}
		}

		// Structure and send the response data
		res.json({
			city: data.location.name,
			temperature: data.current.temp_c,
			condition: data.current.condition.text,
			chanceOfRain: data.forecast.forecastday[0].day.daily_chance_of_rain,
			textColor,
			moistLevel,
			moonPhase: data.forecast.forecastday[0].astro.moon_phase,
			averageTemp,
			maxTemp,
			minTemp,
			maxUVIndex,
			maxUVTime,
			// Add your own data here for extra points! Please be sure to coordinate with your frontend team members.
		});
	} catch (error) {
		console.error("Error fetching data from Weather API:", error);
		res.status(500).json({ error: "Failed to fetch weather data" });
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
