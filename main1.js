import {
  searchForm, degreesOut, weatherIcon, favIcon, detailsTemp, detailsFeels, detailsWeather, detailsSunrise, detailsSunset, cityOutput } from "./DOM.js"

let {format} = require('date-fns');
searchForm.addEventListener('submit', showWeather);

async function showWeather(event){
    event.preventDefault();
    let city = getCityName(event);
    let data = await getWeatherData(city);
    showWeatherDataOnScreen(data);
    render();
};

function getCityName (event){
    let currentCity = localStorage.getItem("currentCity");
    let cityName;
    if (event.type === 'load'&& currentCity !=null) {
        cityName = currentCity;
     } else if (event.type === "submit") {
        cityName = document.querySelector("#search-bar-input").value;
     } else if (event.type === "click") {
        cityName = event.currentTarget.textContent;
     }
    setCookie('currentCity', cityName, {secure:true, 'max-age':60});
    // localStorage.setItem("currentCity",cityName);
    return cityName;
};

async function getWeatherData(cityName){
    const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
    const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';
    const URL = `${serverUrl}?q=${cityName}&appid=${apiKey}&units=metric`;
    let response = await fetch(URL);
    let weatherData = await response.json();
    return weatherData;
};

function showWeatherDataOnScreen(data){
    cityOutput.textContent = data.name;
    let temp = data.main.temp;
    degreesOut.textContent = Math.round(temp)+'°C';

    let iconCode = data.weather[0].icon;
    weatherIcon.src=`https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    detailsTemp.textContent = data.main.temp;
    detailsFeels.textContent = data.main.feels_like;
    detailsWeather.textContent = data.weather[0].main;
    
    let unixTimeStampSunrise = data.sys.sunrise;
    detailsSunrise.textContent  = format (new Date (unixTimeStampSunrise*1000), 'HH:mm:ss');
    

    let unixTimeStampSunset = data.sys.sunset;
    detailsSunset.textContent  = format (new Date (unixTimeStampSunset*1000), 'HH:mm:ss');

};
window.addEventListener("load",showWeather);
favIcon.addEventListener('click', addCity);

const cityList = new Set (parseCitiesFromStorage());


function setCookie(name, value, options = {}) {

  options = {
    path: '/',
    // при необходимости добавьте другие значения по умолчанию
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

function parseCitiesFromStorage() {
    let citiesFromStorage = localStorage.getItem("favcities");
    return JSON.parse(citiesFromStorage) || [];
};

function addCity(){
    let city = cityOutput.textContent;
    cityList.add(city);
    render();
};

function deleteCity(){
    let cityToDelete=event.currentTarget.parentNode.textContent;
    cityList.delete(cityToDelete);
    render()      
};

function render() {
    let cityListContainer = document.querySelector("#saved-cities-list");
    while (cityListContainer.firstChild) {
        cityListContainer.removeChild(cityListContainer.firstChild);
    }
    
    for (const city of cityList){
        let newCity = document.createElement("li");
        newCity.addEventListener("click", showWeather);
        newCity.textContent = city;
        cityListContainer.appendChild(newCity);

        let deleteButton = document.createElement('input');
        deleteButton.type = "button";
        deleteButton.class = "delete-city";
        deleteButton.value = "X";
        deleteButton.addEventListener("click",deleteCity);

        newCity.appendChild(deleteButton);
    }
    localStorage.setItem("favcities",JSON.stringify([...cityList]));
}
