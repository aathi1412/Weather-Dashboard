import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

const setTime = document.querySelector('.js-time');
const setDate = document.querySelector('.js-date');

setInterval(() => {
    let date = new Date();
    let time = date.getTime();
    // let day = date.getDate();
    // console.log(dayjs(day).format('DD-MM-YYYY'));
    setTime.innerHTML = dayjs(time).format('HH:mm A');
    setDate.innerHTML = dayjs(time).format('dddd, DD MMM');
}, 1000)

const API_KEY = 'a856a832c1394edf622f5ec5b344a1dd';

let api = 'https://api.openweathermap.org/data/4.0/onecall/current?lat={lat}&lon={lon}&appid={API key}';

let geocoding = 'http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}';