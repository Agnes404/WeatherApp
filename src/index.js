function formatDate(now){
  let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let day = days[now.getDay()];
  let months =["January","February","March","April","May","June","July","August","September","October","November","December"];
  let month = months[now.getMonth()];
  let date = now.getDate();
  
  return `${day}, ${month} ${date}`;
}

let now = new Date();
let currentDate = document.querySelector("#current-date");
currentDate.innerHTML = formatDate(now);



function formatTime(now){
  let hours = now.getHours();
  let minutes = now.getMinutes();
  if (hours < 10) {
    hours = `0${hours}`};
  if (minutes < 10) {
    minutes = `0${minutes}`}
      
  return `${hours}:${minutes}`;
}
    
let currentTime = document.querySelector("#current-time");
currentTime.innerHTML= formatTime(now);



function changeToFahrenheit(event){  
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temperature");
  let temp = Math.round(celsius * 9/5 + 32); 
  currentTemperature.innerHTML = temp;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

}

function changeToCelsius(event){
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temperature");
  currentTemperature.innerHTML = Math.round(celsius);
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

let celsius = null;

let celsiusLink = document.querySelector("#celsius");
let fahrenheitLink = document.querySelector("#fahrenheit");

celsiusLink.addEventListener("click", changeToCelsius);
fahrenheitLink.addEventListener("click", changeToFahrenheit);



function showWeather(response){
  let city = document.querySelector("#city");
  city.innerHTML = response.data.name;
 
  celsius = response.data.main.temp;

  let currentTemperature = document.querySelector("#current-temperature");
  currentTemperature.innerHTML = Math.round(celsius);
  let feelsLikeTemp = document.querySelector("#feels-like");
  feelsLikeTemp.innerHTML = `${Math.round(response.data.main.feels_like)}°C`;
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${response.data.main.humidity}%`;
  let wind = document.querySelector("#wind");
  wind.innerHTML = `${response.data.wind.speed} km/h`;
  let description = document.querySelector("#description");
  description.innerHTML = response.data.weather[0].description;
}

function getForecastDate(timestamp){
  let date = new Date(timestamp);
  let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let day = days[date.getDay()];
  return day;
}

function displayForecast (response){
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;
  
  
  for (let index = 1; index < 6; index++) {
  forecast = response.data.daily[index]
  forecastElement.innerHTML += `
     <div class="col-sm forecastGrid">
        <div class="card h-100 card border-info mb-3">
          <img
          src="images/${forecast.weather[0].icon}.png"
          class="card-img-top"
          id="weather-icon"
          alt="Weather prediction icon"
          />
          <div class="card-body">
            <h5 class="card-title">
              ${getForecastDate(forecast.dt * 1000)}
            </h5>
            <p class="card-text">
              <strong>
              ${Math.round(forecast.temp.max)}°C 
              </strong> 
              |
              ${Math.round(forecast.temp.min)}°C
            </p>
          </div>
        </div>
      </div>
      `;
  }
}

function search (inputCity){
  let apiKey = "2af3f8b254a603f2b9c0355c32990678";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
  
  
  function convertCity(response){
    let apiKey = "2af3f8b254a603f2b9c0355c32990678";
    let latitude = response.data.coord.lat;
    let longitude = response.data.coord.lon;
    apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);
  }
  axios.get(apiUrl).then(convertCity);
}

function handleSubmit(event){
  event.preventDefault();
  let inputCity = document.querySelector("#search-input").value;
  search(inputCity);
  document.querySelector("#search-input").value = "";
}

let searchEngine = document.querySelector("#search-engine");
searchEngine.addEventListener("submit", handleSubmit);

search("Malaga");

function handleLocation(position){
  let apiKey = "2af3f8b254a603f2b9c0355c32990678";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function navigation(event){
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handleLocation);
}
let currentLocation = document.querySelector("#current-location-button");
currentLocation.addEventListener("click", navigation);

