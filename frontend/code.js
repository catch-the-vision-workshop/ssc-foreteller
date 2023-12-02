// Access the form element with the ID 'cityForm' from the HTML document
const cityForm = document.getElementById("cityForm");

// Define a dictionary (object) mapping moon phases to their respective emoji representations
const moonPhaseEmojis = {
	"New Moon": "🌑",
	"Waxing Crescent": "🌒",
	"First Quarter": "🌓",
	"Waxing Gibbous": "🌔",
	"Full Moon": "🌕",
	"Waning Gibbous": "🌖",
	"Last Quarter": "🌗",
	"Waning Crescent": "🌘",
};

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

	// Initialize a string to hold moisture level emojis
	let moistLevelEmojis = "";
	// Loop through the number of times indicated by 'result.moistLevel' and append water drop emojis
	for (let i = 0; i < forecastData.moistLevel; i++) {
		moistLevelEmojis += "💧";
	}

	// Construct HTML content to display the forecast data
	const resultHTML = `
        <div class=\"flex flex-col items-center justify-center\">
			<span>Current temperature in ${forecastData.city} is:</span>
            <span style="color: ${forecastData.textColor}" class="text-center font-bold text-2xl">
                ${forecastData.temperature}&#8451;
            </span>
        </div>
        <div>Chance of rain: ${forecastData.chanceOfRain}%</div>
        <div>Moist Level: ${moistLevelEmojis}</div>
        <div>Moon Phase: ${moonPhaseEmojis[forecastData.moonPhase]}</div>
    `;

	// Update the inner HTML of the element with ID 'result' to display the constructed HTML content
	document.getElementById("result").innerHTML = resultHTML;
};
