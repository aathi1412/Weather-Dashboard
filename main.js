import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

const API_KEY = 'a856a832c1394edf622f5ec5b344a1dd';
let date = new Date();

// search---------------------------
const search = document.querySelector('.input-search');

document.querySelector('.button-search').addEventListener('click', () => {
    const cityName = search.value;
    getCoordinates(cityName);
})


let getCoordinates = (cityName) => {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        getPlace(data);
        currentWeatherAPI(data);
    });
}

const place = document.querySelector('#place');
const code = document.querySelector('#code');

let getPlace = (data) => {
    let { name, country, state} = data[0];
    place.innerHTML =  `${name}/${state}`
    code.innerHTML = country;
}


let currentWeatherAPI = (data) => {
    let { lat, lon } = data[0];

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
        console.log(data);
        currentWeatherData(data);
    })

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
        console.log(data);
        forecastAPI(data);
    })

    
}

const currentWeatherHTML = document.querySelector('.current-weather-info');

const sectionHTML = document.querySelector('.section-grid');

const todayWeatherHTML = document.querySelector('.weather-today-container');

let currentWeatherData = (data) => {
    const { feels_like, humidity, pressure, temp, temp_max, temp_min} = data.main;
    const { sunrise, sunset } = data.sys;
    const { main, icon } = data.weather[0];
    const { all } = data.clouds;
    const { speed } = data.wind;
    // const today = date.getDate();

    let html = `
        <div class="current-weather-box">
            <div class="weather-items essential" >
                <div>Temperature:</div>
                <div>${temp} °C</div>
            </div>
            <div class="weather-items essential">
                <div>weather:</div>
                <div>${main}</div>
            </div>
            <div class="weather-items essential">
                <div>Clouds:</div>
                <div>${all} %</div>
            </div>
            <div class="weather-items essential">
                <div>Sunrise:</div>
                <div>${dayjs(sunrise).format('HH: mm A')}</div>
            </div>
            <div class="weather-items essential">
                <div>Sunset:</div>
                <div>${dayjs(sunset).format('HH: mm A')}</div>
            </div>
            <div class="weather-items">
                <div>Feels like: 
                    <span> ${feels_like} °C</span>
                </div>
            </div>
            <div class="weather-items">
                <div>high: <span> ${temp_max} °C</span></div>
            </div>
            <div class="weather-items">
                <div>low: <span> ${temp_min} °C</span></div>
            </div>
        </div>
    `;
    currentWeatherHTML.innerHTML = html;
        
    let h = `
        <div class="grid">
            <span>Humidity</span>
            <i class="fa-solid fa-droplet fa-beat" style="color: rgb(219, 222, 228);"></i>
            <span>${humidity} %</span>
        </div>
        <div class="grid">
            <span>Wind</span>
            <i class="fa-solid fa-wind fa-beat" style="color: rgb(219, 222, 228);"></i>
            <span>${speed} m/s</span>
        </div>
        <div class="grid">
            <span>Pressure</span>
            <i class="fa-solid fa-smog fa-beat" style="color: rgb(219, 222, 228);"></i>
            <span >${pressure} hPa</span>
        </div>
    `;
    sectionHTML.innerHTML = h;
    

    let forcasthtml = `
            <div id="cards-today">
                <div class="image-contain">
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather-icon">
                    <p>${main}</p>
                </div>
                <div class="content-today">
                    <p class="day">${dayjs().format('dddd')}</p>
                    <p>High: <span>${temp_max}°C</span></p>
                        <p>Low: <span>${temp_min}°C</span></p>
                    <p>
                        <i class="fa-solid fa-droplet fa-beat" style="color: rgb(219, 222, 228);"></i>
                        <span>${humidity}%</span>
                    </p>
                </div>
            </div>
    `;
    todayWeatherHTML.innerHTML = forcasthtml;
}

// -------------forecastAPI----------
let forecastAPI = (data) => {
    let date = new Date();
    let today = dayjs(date.getTime()).format("YYYY-MM-DD");

    const dailyForecast = data.list.filter((days) => {
        const forecastDate = dayjs(days.dt_txt).format("YYYY-MM-DD");
        return ( forecastDate !== today && days.dt_txt.includes("12:00:00") );
    });
    console.log(dailyForecast);

    let totalHTML = '';
    dailyForecast.map((day) => {
        let html = `
            <div class="cards">
                <div class="container-content">
                    <div class="image-contain">
                        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather-icon">
                        <p>${day.weather[0].main}</p>
                    </div>
                    <div class="content">
                        <p class="day">${dayjs(day.dt_txt).format('ddd')}</p>
                        <p>High: <span>${day.main.temp_min} °C</span></p>
                        <p>Low: <span>${day.main.temp_max} °C</span></p>
                        <p>
                            <i class="fa-solid fa-droplet fa-beat" style="color: rgb(219, 222, 228);"></i>
                            <span>${day.main.pressure} %</span>
                        </p>
                    </div>
                </div>
            </div>
        `;
        totalHTML += html;
    });

    const forecastHTML = document.querySelector('.future-forcast-grid');
    forecastHTML.innerHTML = totalHTML;
    
}

// -----------------------datae time
const setTime = document.querySelector('.js-time');
const setDate = document.querySelector('.js-date');

setInterval(() => {
    let date = new Date();
    let time = date.getTime();
    setTime.innerHTML = dayjs(time).format('HH:mm A');
    setDate.innerHTML = dayjs(time).format('dddd, DD MMM');
}, 1000)



// let geocoding = ;



// https://api.openweathermap.org/data/4.0/onecall/current?lat={lat}&lon={lon}&appid={a856a832c1394edf622f5ec5b344a1dd}