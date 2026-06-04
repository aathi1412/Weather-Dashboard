import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

const API_KEY = 'a856a832c1394edf622f5ec5b344a1dd';

// search---------------------------
const search = document.querySelector('.input-search');

document.querySelector('.button-search').addEventListener('click', () => {
    const cityName = search.value;
    console.log(cityName);
    getCoordinates(cityName);
})


let getCoordinates = (cityName) => {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
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
    console.log(country);
    console.log(name);
    console.log(state);
}

let currentWeatherAPI = (data) => {
    let { lat, lon } = data[0];

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
        console.log(data);
    })

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=7&appid=${API_KEY}&units=metric`).then(res => res.json()).then(data => {
        console.log(data);
    })

    
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