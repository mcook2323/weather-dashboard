const apiKey = '67d7d92b80ca404a9492ed5612fe4b02';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=imperial&q=';

const apiUrlDay = 'https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=';

const searchBox = document.getElementById('search-city');
const searchBtn = document.getElementById('search-btn');

async function checkweather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
  const data = await response.json();

  if (response.ok && data.name !== undefined) {
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    document.querySelector(".city").innerHTML = 'Location: ' + data.name;
    document.querySelector('.icon').innerHTML = `<img src="${iconUrl}" alt="weather icon">`;
    document.querySelector(".temp").innerHTML = 'Temp: ' + Math.round(data.main.temp) + ' &degF';
    document.querySelector(".wind").innerHTML = 'Wind Speed: ' + data.wind.speed + ' mp/h';
    document.querySelector(".humidity").innerHTML = 'Humidity: ' + data.main.humidity + '%';

    saveSearch(city);
    displaySearchHistory();
  } 
}

searchBox.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const city = searchBox.value;
    checkweather(city);
    dayForecast(city);
  }
});
searchBtn.addEventListener('click', ()=>{
  const city = searchBox.value;
  checkweather(city);
  dayForecast(city);

})

function dayForecast(city) {
  fetch(apiUrlDay + city + `&appid=${apiKey}`)
    .then(function(response) {
      return response.json(); 
    })
    .then(data => {
      const forecastContainer = document.querySelector('.day-forecast');
      forecastContainer.innerHTML = '';
      const forecasts = data.list.filter((item, index) => index % 8 === 0);

      forecasts.forEach(forecast => { 
        const date = forecast.dt_txt;
        const icon = forecast.weather[0].icon; 
        const temp = forecast.main.temp;
        const wind = forecast.wind.speed;
        const humidity = forecast.main.humidity;

        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`
        const container = document.createElement('div');
        container.classList.add('forecast-item');
        container.innerHTML = `<p>Date: ${date}</p><img src="${iconUrl}" alt="weather icon"><p>Temp: ${Math.round(temp)} &degF</p><p>Wind Speed: ${wind} mp/h</p><p>Humidity: ${humidity}%</p>`;
        forecastContainer.appendChild(container);
      });
      saveSearch(city);
      
    })
    .catch(error => {
      console.error('There was a problem fetching the data:', error);
    });
}

function saveSearch(city){
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  searchHistory.push(city);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

function displaySearchHistory() {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  const historyContainer = document.querySelector('.col-history');

  historyContainer.innerHTML = '';
  const recentSearches = searchHistory.slice(-5); 

  recentSearches.forEach(city => {
    
    const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);

    const button = document.createElement('button');
    button.textContent = capitalizedCity;
    button.classList.add('history-btn');

  
    button.addEventListener('click', () => {
      checkweather(city);
      dayForecast(city);
    });

    historyContainer.appendChild(button);
  });
  localStorage.setItem('searchHistory', JSON.stringify(recentSearches));
}




checkweather();
dayForecast();
displaySearchHistory();