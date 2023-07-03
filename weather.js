const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherEl = document.getElementById('current-weather-items');
const stateCountryEl = document.getElementById('state-country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');



const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 
'October', 'November', 'December'];

const apikey = "a1202557ae1802d5a76566455cd058da";

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const day = time.getDay();
    const date = time.getDate();
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const hour12 = hour >= 13 ? hour%12 : hour;
    const ampm = hour>=12 ? 'PM' : 'AM';
    timeEl.innerHTML = (hour12 < 10 ? '0' + hour12 : hour12) + ":" + (minutes < 10 ? '0' + minutes : minutes) + " " + '<span id="am-pm">'+ampm+'</span>';
    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];
}, 1000);

function inputValue(){
    let inputValue = document.getElementById("city").value;
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + inputValue +
    '&limit=5&appid=' + apikey).then(res => res.json()).then(data => {
        console.log(data)
        let{lat, lon} = data[0];
        fetch('https://api.openweathermap.org/geo/1.0/reverse?lat=' + lat + '&lon='+ 
        lon + '&appid=' + apikey).then(res => res.json()).then(data => {
            console.log(data)
            showLocation(data);
        })
        fetch('https://api.openweathermap.org/data/3.0/onecall?lat=' + lat +
        '&lon=' + lon + '&units=metric&appid=' + apikey).then(res => res.json()).then(data => {

            console.log(data)
            showWeatherData(data);
        })

    })
}

getWeatherData()

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        let{latitude, longitude} = success.coords;
        fetch('https://api.openweathermap.org/geo/1.0/reverse?lat=' + latitude + '&lon='+ 
        longitude + '&appid=' + apikey).then(res => res.json()).then(data => {
            console.log(data)
            showLocation(data);
        })
        fetch('https://api.openweathermap.org/data/3.0/onecall?lat=' + latitude +
        '&lon=' + longitude + '&units=metric&appid=' + apikey).then(res => res.json()).then(data => {

            console.log(data)
            showWeatherData(data);
        })
    })
}

function showLocation(data) {
    let {name,lat, lon, country, state} = data[0];
    stateCountryEl.innerHTML = `
    
    <div class="location">` + name + `</div>
    <div class="state-country" id="state-country">` + state + `, ` + country + `</div>
    <div class="lon-lat">`+ lon +` E, `+ lat + ` N</div>`;
}

function showWeatherData(data)  {
    let {humidity,pressure, sunrise, sunset, wind_speed} = data.current;
    currentWeatherEl.innerHTML = 
    
    `<div class="weather-items">
        <div>Humidity</div>
        <div>`+ humidity + `%</div>
    </div>
    <div class="weather-items">
        <div>Pressure</div>
        <div>`+pressure + `</div>
        </div>
    <div class="weather-items">
        <div>Wind Speed</div>
        <div>`+ wind_speed + `</div>
    </div>
    <div class="weather-items">
        <div>Sunrise</div>
        <div>`+ window.moment(sunrise * 1000).format('HH:mm a') + `</div>
    </div>
    <div class="weather-items">
        <div>Sunset</div>
        <div>`+ window.moment(sunset * 1000).format('HH:mm a') + `</div>
    </div>`;

    var otherForecast = '';
    data.daily.forEach((day, index) => {
        if(index == 0)  {
            currentTempEl.innerHTML = `
            <div class="today" id="current-temp">
            <img src="https://openweathermap.org/img/wn/` + day.weather[0].icon +`@4x.png" alt="weather icon" class="w-icon" />
            <div class="other">
                <div class="day">` + window.moment(day.dt * 1000).format('ddd ') + `</div>
                <div class="temp">Night :<br> `+ day.temp.night +`&#176; C</div>
                <div class="temp">Day : <br>` + day.temp.day +` &#176; C</div>
            </div>`;
        } else  {
            otherForecast += 
            `<div class="weather-forecast-item">
                <div class="day">` + window.moment(day.dt * 1000).format('ddd') + `</div>
                <img src="https://openweathermap.org/img/wn/` + day.weather[0].icon + `@2x.png" alt="weather icon" class="w-icon" />
                <div class="temp">Night : <br>` + day.temp.night + ` &#176; C</div>
                <div class="temp">Day : <br>` + day.temp.day + ` &#176; C</div>
                <div class="temp">Pressure: <br>` + day.pressure + ` </div>
                <div class="temp">Humidity:<br> ` + day.humidity + ` %</div>
                <div class="temp">Wind Speed: <br>` + day.wind_speed + `</div>

            </div>`
        }

    });

    weatherForecastEl.innerHTML = otherForecast;

}

