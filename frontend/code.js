// Access the form element with the ID 'cityForm' from the HTML document
const cityForm = document.getElementById("cityForm");

// Define an asynchronous function to fetch weather forecast data for a given city
async function getForecast(cityName) {
	try {
		// Perform a fetch request to the specified URL, passing the city name as a query parameter
		const response = await fetch(`http://localhost:3000/getForecast?cityName=${cityName}`);
		// Parse the JSON response from the server
		const data = await response.json();
		// Return the parsed data
		return data;
	} catch (error) {
		// Log any errors encountered during the fetch operation
		console.error("Error fetching forecast:", error);
		// Return null to indicate an unsuccessful operation
		return null;
	}
}

// Add an 'onsubmit' event listener to the cityForm
cityForm.onsubmit = async function (event) {
	// Prevent the default form submission behavior which refreshes the page
	event.preventDefault();
	// Set the inner text of the element with ID 'result' to "Loading..."
	document.getElementById("result").innerText = "Loading...";

	// Retrieve the value from the input field with ID 'city' in the form
	const city = document.getElementById("city").value;
	// Call getForecast function with the city name and await the result
	const forecastData = await getForecast(city);

	// Check if forecastData is not available (null or undefined)
	if (!forecastData) {
		// Update the result element to display an error message
		document.getElementById("result").innerText = "Failed to load data.";
		return;
	}

	// Loop through the number of times indicated by 'result.moistLevel' and append water drop emojis
	let moistLevelEmojis = "";
	for (let i = 0; i < forecastData.moistLevel; i++) {
		moistLevelEmojis += "💧";
	}

	// Determine which moon phase emoji to use based on 'forecast.moonPhase'
	let moonPhaseEmojis = "";
	if (forecastData.moonPhase === "New Moon") {
		moonPhaseEmojis = "🌑";
	} else if (forecastData.moonPhase === "Waxing Crescent") {
		moonPhaseEmojis = "🌒";
	} else if (forecastData.moonPhase === "First Quater") {
		moonPhaseEmojis = "🌓";
	} else if (forecastData.moonPhase === "Waxing Gibbous") {
		moonPhaseEmojis = "🌔";
	} else if (forecastData.moonPhase === "Full Moon") {
		moonPhaseEmojis = "🌕";
	} else if (forecastData.moonPhase === "Waning Gibbous") {
		moonPhaseEmojis = "🌖";
	} else if (forecastData.moonPhase === "Last Quarter") {
		moonPhaseEmojis = "🌗";
	} else if (forecastData.moonPhase === "Waning Crescent") {
		moonPhaseEmojis = "🌘";
	}

	// Construct HTML content to display the forecast data
	const resultHTML = `
	<div class="flex flex-col items-center justify-center rounded-lg p-4">
		<h2 class="text-xl font-semibold mb-2">Weather in ${forecastData.city}</h2>
		<div class="flex items-center justify-center space-x-4 mb-4">
			<p class="text-lg" style="color: ${forecastData.textColor}">Current Temp: ${forecastData.temperature}&#8451;</p>
		</div>
		<div class="grid grid-cols-3 gap-4 mb-4 text-center">
			<div>
				<img src="../img/icon-temp.png" alt="Average Temperature" class="h-6 w-6 mx-auto"/>
				<p>Avg: ${forecastData.averageTemp.toFixed(2)}&#8451;</p>
			</div>
			<div>
				<img src="../img/icon-cold.png" alt="Minimum Temperature" class="h-6 w-6 mx-auto"/>
				<p>Min: ${forecastData.minTemp.toFixed(2)}&#8451;</p>
			</div>
			<div>
				<img src="../img/icon-hot.png" alt="Maximum Temperature" class="h-6 w-6 mx-auto"/>
				<p>Max: ${forecastData.maxTemp.toFixed(2)}&#8451;</p>
			</div>
		</div>
		<div class="flex items-center justify-center space-x-4 mb-4">
			<img src="../img/icon-rain.png" alt="Rain" class="h-6 w-6"/>
			<p>Chance of Rain: ${forecastData.chanceOfRain}%</p>
		</div>
		<div class="flex items-center justify-center space-x-4 mb-4">
			<img src="../img/icon-humidity.png" alt="Humidity" class="h-6 w-6"/>
			<p>Humidity: ${moistLevelEmojis}</p>
		</div>
		<div class="flex items-center justify-center space-x-4 mb-4">
			<img src="../img/icon-moon.png" alt="Moon Phase" class="h-6 w-6"/>
			<p>Moon Phase: ${moonPhaseEmojis}</p>
		</div>
		<div class="flex items-center justify-center space-x-4">
			<img src="../img/icon-uv.png" alt="UV Index" class="h-6 w-6"/>
			<p>UV Max: ${forecastData.maxUVIndex} at ${forecastData.maxUVTime}</p>
		</div>
	</div>
	`;

	// Update the inner HTML of the element with ID 'result' to display the constructed HTML content
	document.getElementById("result").innerHTML = resultHTML;
};
