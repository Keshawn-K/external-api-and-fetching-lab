// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area=";

// Validate that the input is exactly two uppercase letters
function validateStateAbbr(abbr) {
  return /^[A-Z]{2}$/.test(abbr);
}

// Show or hide the loading message
function toggleLoading(isLoading) {
  const loadingDiv = document.getElementById("loading");

  if (isLoading) {
    loadingDiv.classList.remove("hidden");
  } else {
    loadingDiv.classList.add("hidden");
  }
}

// Display an error message
function displayError(message) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
}

// Display alert data in the DOM
function displayAlerts(data) {
  const alertsDisplay = document.getElementById("alerts-display");

  // Clear previous alert content
  alertsDisplay.innerHTML = "";

  // Clear and hide any previous error message
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");

  const alertCount = data.features ? data.features.length : 0;

  // Display title and number of alerts
  const title = document.createElement("h2");
  title.textContent = `Current watches, warnings, and advisories for ${data.title}: ${alertCount}`;
  alertsDisplay.appendChild(title);

  // Display each alert headline
  const alertList = document.createElement("ul");

  if (data.features && data.features.length > 0) {
    data.features.forEach(alert => {
      const listItem = document.createElement("li");
      listItem.textContent = alert.properties.headline;
      alertList.appendChild(listItem);
    });
  }

  alertsDisplay.appendChild(alertList);
}

// Fetch weather alerts for the selected state
function fetchWeatherAlerts(state) {
  toggleLoading(true);

  fetch(`${weatherApi}${state}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Unable to fetch weather alerts.");
      }

      return response.json();
    })
    .then(data => {
      displayAlerts(data);
    })
    .catch(error => {
      displayError(error.message);
    })
    .finally(() => {
      toggleLoading(false);
    });
}

// Handle button click
document.getElementById("fetch-alerts").addEventListener("click", () => {
  const input = document.getElementById("state-input");
  const state = input.value.trim().toUpperCase();

  // Clear the input immediately after click
  input.value = "";

  if (!validateStateAbbr(state)) {
    displayError("Please enter a valid 2-letter state abbreviation.");
    return;
  }

  fetchWeatherAlerts(state);
});