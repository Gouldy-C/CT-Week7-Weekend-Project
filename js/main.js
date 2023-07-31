

const searchField = document.querySelector(".search-field");
const submitBtn = document.querySelector("#button-search");
const dateHeader = document.querySelector('.date-time')
const cityHeader = document.querySelector('.city-header')
const weatherHeader = document.querySelector('.weather-header')
const hourlyCard = document.querySelector('.hourly-forecasts')
const sunriseTime = document.querySelector('.sunrise')
const sunsetTime = document.querySelector('.sunset')
const curTemp = document.querySelector('.temp-actual')
const curTempMaxMin = document.querySelector('.temp-high-low')
const curTempFeels = document.querySelector('.temp-feels-div')
const windDeg = document.querySelector('.wind-direction')
const windArrow = document.querySelector('.wind-arrow')
const windSpeed = document.querySelector('.wind-avg')
const windGust = document.querySelector('.wind-gust')
const dailyForecasts = document.querySelector('.daily-forecasts')
const body = document.querySelector('body')


let dataCurrent;
let dataForecast;
let searchString;
let units = "imperial";

const wd = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

const months = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
};



//icon url just replace the  with icon value from data
// https://openweathermap.org/img/wn/10d@2x.png

startUp();

async function startUp() {
  await getCurrentWeather();
  console.log(dataCurrent);
  console.log(dataForecast);
  setData();
}

function titleCase(str) {
  return str
    .split(" ")
    .map((x) => x[0].toUpperCase() + x.slice(1))
    .join(" ");
}

function ForC() {
  return units ==='imperial' ? '&#8457;' : '&#8451;'
}

function formatTime(h, m) {
  let hour12;
  h = h < 0 ? 24 + h : h;
  m = m < 10 ? "0" + m : m;
  hour12 = h < 12 ? "AM" : "PM";
  h = h == 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h}:${m} ${hour12}`;
}

async function imperial() {
  units = "imperial";
  await getCurrentWeather();
  setData()
}

async function metric() {
  units = "metric";
  await getCurrentWeather();
  setData()
}
async function getLocation() {
  const res = await fetch(
    `https://api.geoapify.com/v1/ipinfo?&apiKey=${locationApiKey}`
  );
  const data = await res.json();
  searchString = `${data.city.name}, ${data.state.name}, ${data.country.name}`;
}

async function getCurrentWeather() {
  let resCurrent;
  let resForecast;
  if (!searchString) {
    await getLocation();
  }
  if (Number(searchString)) {
    resCurrent = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?zip=${searchString}&appid=${weatherApiKey}&units=${units}`
    );
    resForecast = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?zip=${searchString}&appid=${weatherApiKey}&units=${units}`
    );
  } else {
    resCurrent = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchString}&appid=${weatherApiKey}&units=${units}`
    );
    resForecast = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${searchString}&appid=${weatherApiKey}&units=${units}`
    );
  }
  if (resCurrent.ok) {
    dataCurrent = await resCurrent.json();
  } else {
    console.log("Bad Response");
    return "Bad Response";
  }
  if (resForecast.ok) {
    dataForecast = await resForecast.json();
  } else {
    console.log("Bad Response");
    return "Bad Response";
  }
}

function setData() {
  //current date time adjusted for location
  const d = new Date();
  const currentDate = new Date(
    d.getTime() + d.getTimezoneOffset() * 60000 + dataCurrent.timezone * 1000
  );
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();
  const dayWeek = currentDate.getDay();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  //current day sunrise and sunset time adjusted for location
  const rise = new Date(dataCurrent.sys.sunrise * 1000);
  const set = new Date(dataCurrent.sys.sunset * 1000);
  const sunriseDate = new Date(
    rise.getTime() +
      rise.getTimezoneOffset() * 60000 +
      dataCurrent.timezone * 1000
  );
  const sunsetDate = new Date(
    set.getTime() +
      set.getTimezoneOffset() * 60000 +
      dataCurrent.timezone * 1000
  );
  const sunrise = formatTime(sunriseDate.getHours(), sunriseDate.getMinutes());
  const sunset = formatTime(sunsetDate.getHours(), sunsetDate.getMinutes());

  const cityName = titleCase(dataCurrent.name);

  const currentWeather = titleCase(dataCurrent.weather[0].description);

  const currentTemp = Math.round(dataCurrent.main.temp);
  const currentTempMax = Math.round(dataCurrent.main.temp_max);
  const currentTempMin = Math.round(dataCurrent.main.temp_min);
  const currentTempFeels = Math.round(dataCurrent.main.feels_like);

  const currentWindDeg = dataCurrent.wind.deg;
  const currentWindAvg = dataCurrent.wind.speed
    ? Math.round(dataCurrent.wind.speed)
    : "N/A";
  const currentWindGust = dataCurrent.wind.gust
    ? Math.round(dataCurrent.wind.gust)
    : "N/A"


    hourlyCard.innerHTML = ''
  for (let i = 0; i < 7; i++) {
    const hourlyDate = new Date(
      dataForecast.list[i].dt * 1000 +
        d.getTimezoneOffset() * 60000 +
        dataCurrent.timezone * 1000
    );
    const hourlyTime = formatTime(
      hourlyDate.getHours(),
      hourlyDate.getMinutes()
    );
    const hourlyIcon = dataForecast.list[i].weather[0].icon;
    const hourlyTemp = Math.round(dataForecast.list[i].main.temp);
    hourlyCard.innerHTML += 
    `<div class="card hourly-card text-center">
      <p class="m-1 my-2 lh-1">${hourlyTime}</p>
      <hr class="my-0 text-light">
      <div class="hourly-icon my-1">
        <img class='rounded-4' src="https://openweathermap.org/img/wn/${hourlyIcon}@2x.png"
          alt="">
      </div>
      <p class="mb-2 lh-1">${hourlyTemp} ${ForC()}</p>
    </div>`
  }
  dailyForecasts.innerHTML = ''
  for (let i = 7; i < 40; i += 8) {
    const dailyDate = new Date(
      dataForecast.list[i].dt * 1000 +
        d.getTimezoneOffset() * 60000 +
        dataCurrent.timezone * 1000
    );
    const dailyIcon = dataForecast.list[i].weather[0].icon;
    const dailyDay = `${wd[dailyDate.getDay()]}, ${months[dailyDate.getMonth()]} ${dailyDate.getDate()}`;
    const dailyWeather = titleCase(dataForecast.list[i].weather[0].description);

    let H = -500000
    let L = 500000
    
    for (let a = i - 7; a < i; a++){
      H = dataForecast.list[a].main.temp_max > H ? dataForecast.list[a].main.temp_max : H
      L = dataForecast.list[i].main.temp_min < L ? dataForecast.list[i].main.temp_min : L
    }

    const dailyTempMax = Math.round(H);
    const dailyTempMin = Math.round(L);
    dailyForecasts.innerHTML += 
    `<div
    class="day-forecast py-1 d-flex justify-content-evenly w-100">
    <div class="day-weather-icon mx-1 rounded-4">
      <img
        src="https://openweathermap.org/img/wn/${dailyIcon}@2x.png"
        alt="">
    </div>
    <div class="date-weather text-start">
      <p class="fw-bold m-0">${dailyDay}</p>
      <p class="m-0">${dailyWeather}</p>
    </div>
    <div class="vr text-light mx-1"></div>
    <div class="day-high-low">
      <p class="temp-high m-0">H ${dailyTempMax}${ForC()}</p>
      <hr class="my-1 text-light" />
      <p class="temp-low m-0">L ${dailyTempMin}${ForC()}</p>
    </div>
  </div>`

  }

  dateHeader.innerText = `${wd[dayWeek]}, ${months[month]} ${day} ${year}`

  cityHeader.innerText = `${cityName}`

  weatherHeader.innerText = `${currentWeather}`

  sunriseTime.innerText = `Sunrise: ${sunrise}`

  sunsetTime.innerText = `Sunset: ${sunset}`

  curTemp.innerHTML = `<h2 class="m-0">${currentTemp}${ForC()}</h2>`

  curTempMaxMin.innerHTML = `<p class="temp-high m-0">H ${currentTempMax}${ForC()}</p>
  <hr class="my-1 text-light">
  <p class="temp-low m-0">L ${currentTempMin}${ForC()}</p>`

  curTempFeels.innerHTML = `<p class="m-0">Feels</p>
  <hr class="my-1 text-light">
  <h5 class="m-0 temp-feels">${currentTempFeels}${ForC()}</h5>`

  windDeg.innerHTML = `<h4>${currentWindDeg} &#176;</h4>`

  windArrow.style.rotate=`${currentWindDeg}deg`

  windSpeed.innerHTML = `<p class="m-0">Avg</p>
  <p class="m-0">${currentWindAvg} ${units ==='imperial' ? 'mph' : 'm/s'}</p>`

  windGust.innerHTML = `<p class="m-0">Gust</p>
  <p class="m-0">${currentWindGust} ${units ==='imperial' ? 'mph' : 'm/s'}</p>`

  if (321 >= dataCurrent.weather[0].id >= 300) {
    body.style.background= url('../image/bgs/drizzle.jpg');
  }else if(531 >= dataCurrent.weather[0].id >= 500){
    body.style.background= url('../image/bgs/rain.jpg');
  }else if(622 >= dataCurrent.weather[0].id >= 600){
    body.style.background=`url(../image/bgs/snow.jpg) no-repeat center center fixed;`
  }else if(dataCurrent.weather[0].id === 741){
    body.style.background=`url(../image/bgs/fog.jpg) no-repeat center center fixed;`
  }else if(781 >= dataCurrent.weather[0].id >= 700){
    body.style.background=`url(../image/bgs/athmospher.webp) no-repeat center center fixed;`
  }else if(dataCurrent.weather[0].id === 800){
    body.style.background=`url(../image/bgs/clearsky1.jpg) no-repeat center center fixed;`
  }else if(802 >= dataCurrent.weather[0].id >= 801){
    body.style.background=`url(../image/bgs/Scatered-Clouds.jpg) no-repeat center center fixed;`
  }else if(dataCurrent.weather[0].id === 803){
    console.log('here')
    body.style.backgroundImage='url(../image/bgs/mostly-Cloudy.jpg);'
  }else if(dataCurrent.weather[0].id === 804){
    body.style.backgroundImage='url(../image/bgs/cloudy.jpg) no-repeat center center fixed;'
  }else if(802 >= dataCurrent.weather[0].id >= 801){
    body.style.background=`url(../image/bgs/Scatered-Clouds.jpg) no-repeat center center fixed;`
  }else if(232 >= dataCurrent.weather[0].id >= 212){
    body.style.background='url(../image/bgs/Thunder-Storm.jpg) no-repeat center center fixed;'
  }else if(211 >= dataCurrent.weather[0].id >= 200){
    body.style.background='url(../image/bgs/Thunderstorm.jpg) no-repeat center center fixed;'
  }

}

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  searchString = searchField.value;
  console.log(searchString);
  await startUp();
  console.log(dataCurrent);
  console.log(dataForecast);
})
