'use strict'

// Geolocation tests

// let userLocation = navigator.geolocation.getCurrentPosition(x => console.log(x))

//gives us lat,long and accuracy. also a timestamp.

// NWS endpoint tests

// https://api.weather.gov/   endpoint

// https://api.weather.gov/gridpoints/{wfo}/{x},{y}/forecast  we need office ID (WFO) and then coords

// https://api.weather.gov/points/42.8250496,-85.5303134  -- give an object and a URL for the forecast that we can run through a fetch and then display 

const weatherDisplay = document.querySelector('.weatherDisplay')
const displayCurrent = document.querySelector('.displayCurrent')
const displayForecast = document.querySelector('.displayForecast')
const backgroundImage = document.querySelector('.backgroundContainer')


class UserWeather {
    constructor(lat,long) {
        this.lat = lat
        this.long = long
        this.userCity;
        this.UserState;
    }

    buildUser() {
        let userLat = this.lat
        let userLong = this.long

        fetch(`https://api.weather.gov/points/${userLat},${userLong}`)
        .then(response => response.json())
        .then(locationData => {
            this.fetchForecastData(locationData.properties.forecast)

            this.userCity = locationData.properties.relativeLocation.properties.city

            this.UserState = locationData.properties.relativeLocation.properties.state
        })
    }

    fetchForecastData(forecastUrl) {
        fetch(forecastUrl)
        .then(response => response.json())
        .then(forecastData => {
            this.displayWeather(forecastData)
            console.log(forecastData)
            // this.changeBackground(forecastData)
        })
    }

    displayWeather(forecastData) {

        console.log(forecastData.properties.periods) //an array of 
        // objects for the time of day, first index is current forecast.

        let forecastPeriods = forecastData.properties.periods

            //varibles will be arrays
            const temperatureDisplay = forecastPeriods.map(weatherData => weatherData.temperature+weatherData.temperatureUnit)
           
            const dayName = forecastPeriods.map(weatherData => weatherData.name)
           
            const forecastDisplayShort = forecastPeriods.map(weatherData => weatherData.shortForecast)
           
            const forecastDisplayLong = forecastPeriods.map(weatherData => weatherData.detailedForecast)
           
            const windSpeed = forecastPeriods.map(weatherData =>
                weatherData.windSpeed)
           
            const windDirection = forecastPeriods.map(weatherData => weatherData.windDirection)
           
            const weatherIcon = forecastPeriods.map(weatherData => weatherData.icon)

            //logic for current weather display
            displayCurrent.append(`
            ${dayName[0]}: ${temperatureDisplay[0]}
            `)
            displayCurrent.append(forecastDisplayShort[0])

            const weatherIconDisplay = document.createElement('img')
            weatherIconDisplay.src = `${weatherIcon[0]}`
            displayCurrent.prepend(weatherIconDisplay)
    
            const locationHeader = document.createElement('h4')
            locationHeader.innerHTML = `${this.userCity},${this.UserState}
            Winds:${windDirection[0]} ${windSpeed[0]}`
            displayCurrent.prepend(locationHeader)
            //

            //logic for 14 day forecast
            for(let index = 1;index<forecastPeriods.length;index++){
                const forecastCell = document.createElement('div')
                forecastCell.classList.add('dailyForecast')
                displayForecast.append(forecastCell)

                const forecastIcon = document.createElement('img')
                forecastIcon.classList.add('forecastIcon')
                forecastIcon.src = weatherIcon[index]
            
                forecastCell.innerHTML =`<br>${dayName[index]} 
                ${temperatureDisplay[index]} ${forecastDisplayShort[index]}`
                forecastCell.prepend(forecastIcon)
            }

             //logic for changing background based on current conditions
        const images = [
            `./images/snowyBG.jpg`,
            `./images/sunnyBG.jpg`,
            './images/rainstormBG.jpg'
        ]
        
        if (forecastDisplayShort[0].includes('Snow Showers')){
            backgroundImage.style.backgroundImage = `url(${images[0]})`
        }
        if (forecastDisplayShort[0].includes('Sunny')) {
            backgroundImage.style.backgroundImage = `url(${images[1]})`
        }
        if (forecastDisplayShort[0].includes('Thunderstorms')) {
            backgroundImage.style.backgroundImage = `url(${images[2]})`
        }
        // "url(" + images[x] + ")";
        // })
    }
}

class Button {
    constructor() {

    }

    weatherButton() {

    }
}

// Make a forecast class and break out the logic
navigator.geolocation.getCurrentPosition(coords => new UserWeather(coords.coords.latitude,coords.coords.longitude).buildUser())

// new UserWeather(26.12231,-80.14338).buildUser() //Fort Lauderdale weather for testing other areas weathers.