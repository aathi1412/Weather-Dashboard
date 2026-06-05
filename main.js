import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

const API_KEY = 'a856a832c1394edf622f5ec5b344a1dd';
let date = new Date();

// -----------------------datae time
const setTime = document.querySelector('.js-time');
const setDate = document.querySelector('.js-date');

setInterval(() => {
    let date = new Date();
    let time = date.getTime();
    setTime.innerHTML = dayjs(time).format('HH:mm A');
    setDate.innerHTML = dayjs(time).format('dddd, DD MMM');
}, 1000)
//---------------background---------

const images = [
    "./images/image1.jpg",
    "./images/image3.jpg",
    "./images/image4.jpg",
    "./images/image5.jpg",
    "./images/image6.jpg",
    "./images/image7.jpg",
    "./images/image8.jpg"
];

let current = 0;

setInterval(() => {
    document.body.style.backgroundImage =
        `url(${images[current]})`;

    current++;

    if (current === images.length) {
        current = 0;
    }
}, 30000);

// -------current location------------

function getCurrentLocation(){
    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try{
            const [weatherRes, forecastRes, currentLocationRes] = await Promise.all([
                fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
                ),
                fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
                ),
                fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`)
            ]);

            const weatherData = await weatherRes.json();
            const forecastData = await forecastRes.json();
            const currentLocation = await currentLocationRes.json();

            currentWeatherData(weatherData);
            forecastAPI(forecastData);
            getPlace(currentLocation);
        }
        catch(error){
            alert(error);
            console.error(error);
        }
    },
    (error) => {
        document.querySelector('.error-message').innerHTML = 'Please allow location access to get local weather.'
        alert("Please allow location access to get local weather.");
        console.log(error.message);
    });
}
getCurrentLocation();

// search---------------------------

const search = document.querySelector('.input-search');

search.addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
        const cityName = search.value.trim();
        if(cityName === ''){
            search.placeholder = 'Enter a city name';
            return;
        }
        getCoordinates(cityName);
        search.value = '';
    }
})

document.querySelector('.button-search').addEventListener('click', () => {
    const cityName = search.value.trim();
    if(cityName === ''){
        search.placeholder = 'Enter a city name';
        return;
    }
    getCoordinates(cityName);
    search.value = '';
});



let getCoordinates = async (cityName) => {
    try{
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

        const response = await fetch(url);

        if(!response.ok){
            throw new Error(response.status);
            return;
        }
        const data = await response.json();
        
        getPlace(data);
        currentWeatherAPI(data);
    }
    catch(error){
            alert(error);
            console.error(error);
        }
}

const place = document.querySelector('#place');
const code = document.querySelector('#code');

let getPlace = (data) => {
    if(data.length === 0){
        console.log('invalid city name');
        search.placeholder = 'city not found';
        search.classList.add('invalid-search');
        return;
    }
    search.classList.remove('invalid-search');
    search.placeholder = 'search city';
    document.querySelector('.error-message').innerHTML = '';
    let { name, country, state} = data[0];
    place.innerHTML =  `${name}/${state}`
    code.innerHTML = country;
}


let currentWeatherAPI = async (data) => {
    let { lat, lon } = data[0];

    try{
        const [weatherRes, forecastRes] = await Promise.all([
            fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            ),
            fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            )
        ]);

        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        currentWeatherData(weatherData);
        forecastAPI(forecastData);
    }
    catch(error){
        alert(error);
        console.error(error);
    }
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

