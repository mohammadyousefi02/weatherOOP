const input = document.querySelector("input")
const getLocationBtn = document.querySelector("#get-location-btn")

const weatherImgElem = document.querySelector("#weather-img")
const tempElem = document.querySelector("#temp")
const weatherDescElem = document.querySelector("#weather-desc")
const cityNameElem = document.querySelector("#city-name")
const feelsLikeElem = document.querySelector("#feels-like")
const humidityElem = document.querySelector("#humidity")
const weatherModal = document.querySelector(".weather-modal")
const closeModalBtn = document.querySelector(".bi-arrow-left")
const modalSection = document.querySelector(".modal-section")
const spinner = document.querySelector(".spinner-border")
const errorText = document.querySelector(".error-text-modal")

const API_KEY = "4358f57aac0c35ac0b0d8d61508ebfcd"

const API_By_CITY = (city, key) => {
    const edited = city.split(" ").join("+")
    return `https://api.openweathermap.org/data/2.5/weather?q=${edited}&appid=${key}&units=metric`
}

const API_BY_LOCATION = (lat, lon, key) => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`

class Weather {
    constructor(modal, modalSection, spinner, errorText, weatherImgElem, tempElem, weatherDescElem, nameCityElem, feelsLikeElem, humidityElem) {
        this.modal = modal;
        this.modalSection = modalSection;
        this.spinner = spinner;
        this.errorText = errorText;
        this.weatherImgElem = weatherImgElem
        this.tempElem = tempElem
        this.weatherDescElem = weatherDescElem
        this.nameCityElem = nameCityElem
        this.feelsLikeElem = feelsLikeElem
        this.humidityElem = humidityElem
    }
    getCityWeather = async (api) => {
        try {
            this.spinner.classList.remove("d-none")
            const res = await fetch(api)
            const obj = await res.json()
            this.allFunctions(obj)
            this.spinner.classList.add("d-none")
            this.modalSection.classList.remove("d-none")
        } catch (err) {
            this.spinner.classList.add("d-none")
            errorText.innerText = "sorry we can't find anything,please try again"
            errorText.classList.remove("d-none")
        }
    }
    setCityName = (obj) => {
        this.city = obj.name
    }
    setTemp = (obj) => {
        this.temp = parseInt(obj.main.temp)
    }
    setFeelsLike = (obj) => {
        this.feelsLike = parseInt(obj.main.feels_like)
    }
    setHumidity = (obj) => {
        this.humidity = obj.main.humidity
    }
    setWeather = (obj) => {
        this.weather = obj.weather[0].main;
        this.weatherDesc = obj.weather[0].description;
    }
    setIsDay = (obj) => {
        if (obj.dt >= obj.sys.sunset || obj.dt < obj.sys.sunrise && obj.dt < obj.sys.sunset) this.isDay = false;
        else this.isDay = true;
    }
    setWeatherImg = () => {
        if (this.weather == "Clouds") {
            if (this.isDay) this.weatherImg = "icons8-partly-cloudy-day-96.png"
            else this.weatherImg = "icons8-night-96.png"
        } else if (this.weather == "Rain") this.weatherImg = "icons8-cloud-umbrella-96.png"
        else if (this.weather == "Clear") {
            if (this.isDay) this.weatherImg = "icons8-sun-96.png"
            else this.weatherImg = "icons8-crescent-moon-100.png"
        }
    }
    allFunctions = (obj) => {
        this.setCityName(obj)
        this.setTemp(obj)
        this.setFeelsLike(obj)
        this.setHumidity(obj)
        this.setWeather(obj)
        this.setIsDay(obj)
        this.setWeatherImg()
        this.domUpdater()
    }
    getWeatherWithInputEvent = (elem) => {
        elem.addEventListener("keypress", (e) => {
            if (e.key == "Enter") {
                this.getCityWeather(API_By_CITY(elem.value, API_KEY))
                this.showWeatherModal()
                elem.value = ""
            }
        })
    }
    getLocation = () => {
        if (navigator.geolocation) {
            this.spinner.classList.remove("d-none")
            navigator.geolocation.getCurrentPosition(this.locationRes, this.locationReg);
        } else {
            this.spinner.classList.add("d-none")
            errorText.innerText = "you can't use this feature in this browser"
            errorText.classList.remove("d-none")
        }
    }
    locationRes = (position) => {
        console.log(API_BY_LOCATION(position.coords.latitude, position.coords.longitude, API_KEY))
        this.getCityWeather(API_BY_LOCATION(position.coords.latitude, position.coords.longitude, API_KEY))
    }
    locationReg = () => {
        this.spinner.classList.add("d-none")
        errorText.innerText = "sorry we can't find anything,please try again"
        errorText.classList.remove("d-none")
    }
    getWeatherWithLocationEvent = (elem) => {
        elem.addEventListener("click", () => {
            this.getLocation()
            this.showWeatherModal()
        })
    }
    domUpdater = () => {
        this.weatherImgElem.src = `../public/${this.weatherImg}`
        this.tempElem.innerText = this.temp;
        this.weatherDescElem.innerText = this.weatherDesc
        this.nameCityElem.innerText = this.city;
        this.feelsLikeElem.innerText = this.feelsLike;
        this.humidityElem.innerText = this.humidity;
    }
    showWeatherModal = () => {
        this.modal.classList.remove("d-none")
    }
    closeWeatherModal = () => {
        errorText.classList.add("d-none")
        this.modalSection.classList.add("d-none")
        this.modal.classList.add("d-none")
    }
    closeModalEvent = (elem) => {
        elem.addEventListener("click", this.closeWeatherModal)
    }
}

const cityWeather = new Weather(weatherModal, modalSection, spinner, errorText, weatherImgElem, tempElem, weatherDescElem, cityNameElem, feelsLikeElem, humidityElem)

cityWeather.getWeatherWithInputEvent(input)
cityWeather.getWeatherWithLocationEvent(getLocationBtn)
cityWeather.closeModalEvent(closeModalBtn)