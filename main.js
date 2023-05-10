import {searchForm, degreesOut, weatherIcon, detailsTemp, detailsFeels, detailsWeather, detailsSunrise, detailsSunset, cityOutput} from "./DOM.js"

const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';

searchForm.addEventListener('submit', weatherNow);

window.addEventListener("load",weatherNow);

    function weatherNow(event){
    let city = getCityName();
    console.log(city);
    let data = getWeatherData(city);
    showWeatherDataOnScreen();
}

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
    localStorage.setItem("currentCity",cityName);
    return cityName;
}

async function getWeatherData(cityName){
    const URL = `${serverUrl}?q=${cityName}&appid=${apiKey}&units=metric`;
    let response = await fetch(URL);
    let weatherData = await response.json();
    return weatherData;
}

function showWeatherDataOnScreen(data){
    let temp = data.main.temp;
    degreesOut.textContent = Math.round(temp)+'°C';

    let iconCode = data.weather[0].icon;
    weatherIcon.src=`https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    detailsTemp.textContent = data.main.temp;
    detailsFeels.textContent = data.main.feels_like;
    detailsWeather.textContent = data.weather[0].main;
    let unixTimeStampSunrise = data.sys.sunrise;
    let sunriseDate = new Date(parseInt(unixTimeStampSunrise)*1000);
    let sunriseHours = sunriseDate.getHours();
    let sunriseMins = sunriseDate.getMinutes();

    detailsSunrise.textContent = sunriseHours+ ":" + sunriseMins;

    let unixTimeStampSunset = data.sys.sunset;
    let sunsetDate = new Date(parseInt(unixTimeStampSunset)*1000);
    let sunsetHours = sunsetDate.getHours();
    let sunsetMins = sunsetDate.getMinutes();

    detailsSunset.textContent = sunsetHours+ ":" + sunsetMins;

    event.preventDefault();
}



       



const cityList = (!parseCities()) ? new Set(): parseCities();

function City (name){
    this.name = name;
    this.hello = "hello";
}

window.addEventListener('load',render);

const favIcon = document.querySelector("#save-city-button");
favIcon.addEventListener('click', addCity);


function addCity(){
    let city = new City(cityOutput.textContent);
    cityList.add(city.name);
    render();
}

function deleteCity(){
    let cityToDelete=event.currentTarget.parentNode.textContent;
    cityList.delete(cityToDelete);
    render()      
    };

function parseCities() {
    let citiesFromStorage = localStorage.getItem("favcities");
    let unfilteredList = JSON.parse(citiesFromStorage);
    return (new Set(unfilteredList)); 
};

function render() {
    let cityListContainer = document.querySelector("#saved-cities-list");
    while (cityListContainer.firstChild) {
        cityListContainer.removeChild(cityListContainer.firstChild);
    }
    
    for (const city of cityList){
        let newCity = document.createElement("li");
        newCity.addEventListener("click", weatherNow);
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