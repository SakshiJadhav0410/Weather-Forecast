document.addEventListener('DOMContentLoaded', () => {
  const apiKey = '07454bcd898a6c5d0fef56d80e018620'; 
  const searchButton = document.getElementById('search');
  const inputField = document.getElementById('input');

  searchButton.addEventListener('click', () => {
    const cityName = inputField.value;
    if (cityName) {
      getWeatherData(cityName);
    } else {
      alert('Please enter a city name.');
    }
  });

  async function getWeatherData(city) {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      const weatherData = await response.json();
      if (weatherData.cod === 200) {
        updateCurrentWeather(weatherData);
        getForecastData(city);
      } else {
        alert(weatherData.message);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }

  async function getForecastData(city) {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
      const forecastData = await response.json();
      if (forecastData.cod === '200') {
        updateForecastWeather(forecastData);
      } else {
        alert(forecastData.message);
      }
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    }
  }

  function updateCurrentWeather(data) {
    const cityElement = document.getElementById('city');
    const temperatureElement = document.querySelector('.temperature');
    const weatherIcon = document.querySelector('.weather img');

    cityElement.textContent = `${data.name}, ${data.sys.country}`;
    temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    weatherIcon.alt = data.weather[0].description;
  }

  function updateForecastWeather(data) {
    const templistElement = document.querySelector('.templist');
    const weekFElement = document.querySelector('.weekF');

    templistElement.innerHTML = '';
    weekFElement.innerHTML = '';

    data.list.slice(0, 6).forEach(item => {
      const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const nextDiv = document.createElement('div');
      nextDiv.classList.add('next');
      nextDiv.innerHTML = `
        <div>
          <p class="time">${time}</p>
          <p>${Math.round(item.main.temp_max)} °C / ${Math.round(item.main.temp_min)} °C</p>
        </div>
        <p class="desc">${item.weather[0].description}</p>
      `;
      templistElement.appendChild(nextDiv);
    });

    const days = [];
    for (let i = 0; i < data.list.length; i += 8) {
      days.push(data.list[i]);
    }

    days.slice(0, 4).forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      const dayFDiv = document.createElement('div');
      dayFDiv.classList.add('dayF');
      dayFDiv.innerHTML = `
        <p class="date">${date}</p>
        <p>${Math.round(item.main.temp_max)} °C / ${Math.round(item.main.temp_min)} °C</p>
        <p class="desc">${item.weather[0].description}</p>
      `;
      weekFElement.appendChild(dayFDiv);
    });
  }
  async function populateCityList() {
    try {
      const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=&appid=' + apiKey);
      const cityListData = await response.json();
      cityListData.forEach(city => {
        const option = document.createElement('option');
        option.value = city.name;
        cityList.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching city list:', error);
    }
  }

  populateCityList();

  inputField.addEventListener('focus', () => {
    citySelect.classList.add('active');
  });

  
  inputField.addEventListener('blur', () => {
    citySelect.classList.remove('active');
  });

  
  citySelect.addEventListener('change', () => {
    inputField.value = citySelect.value;
    citySelect.classList.remove('active');
  });
});
