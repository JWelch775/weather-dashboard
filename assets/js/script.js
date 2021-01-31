// API key
var apiKey = "&APPID=f1a7d9757ed88a5b11711781ef3240d4";

//global variables
var city = ""

var searchCity = $("#searchCity");
var searchButton = $("#searchBtn");
var clearButton = $("#clearBtn");
var currentCity = $("#currentCity");
var currentTempEl = $("#temperature");
var humidityEl= $("#humidity");
var windSpeedEl=$("#windSpeed");
var currentUvEl= $("#uvIndex");

var cityArray = [];

// if there is data in localStorage set = to cityArray
if (localStorage.getItem("storedCities"))
    {
        cityArray = JSON.parse(localStorage.getItem("storedCities"));
    }

// display right columns and add currentWeather data
function displayWeather() 
    {
        event.preventDefault();

        // make right column visible
        $("#right-col").removeClass("d-none")

        // if search field is not blank
        if (searchCity !== "") 
        {
            city = searchCity.val().trim();
            currentWeather(city)
        }
    }

// get the weather conditions for the searched city
function currentWeather(city) 
    {

        // make right column visible
        $("#right-col").removeClass("d-none")

        fetch ("https://api.openweathermap.org/data/2.5/weather?q="
        + city + apiKey + "&units=imperial")
        .then(function(response)   
            {
                return response.json();
            })
        .then(function(response)
            {
                console.log(response)
                if (response.cod === 200) 
                    {
                        //date
                        var date = new Date(response.dt*1000).toLocaleDateString();
                        // console.log("Date: " + date)

                        //icon
                        var weatherIcon = response.weather[0].icon;
                        var iconUrl="https://openweathermap.org/img/wn/" + weatherIcon +"@2x.png";

                        $(currentCity).html(response.name +" ("+date+")" + "<img src="+iconUrl+">");

                        //temperature
                        var tempF = Math.round(response.main.temp);
                        $(currentTempEl).html(tempF +"°F");

                        //humidity
                        $(humidityEl).html(response.main.humidity+"%");

                        //wind speed
                        var windspeed = response.wind.speed.toFixed(2);
                        $(windSpeedEl).html(windspeed +" MPH");

                        //UV index
                        var lat = response.coord.lat
                        var lon = response.coord.lon

                        fetch ("https://api.openweathermap.org/data/2.5/uvi?"
                        + "lat=" + lat + "&lon=" + lon + apiKey)
                        .then(function(response) 
                            {
                                return response.json();
                            })
                        .then(function(response) 
                            {
                                // console.log(response)
                                $(currentUvEl).html(response.value);

                                if (parseInt(response.value) < 3) 
                                    {
                                        $(currentUvEl).addClass("bg-success")
                                        $(currentUvEl).removeClass("bg-warning")
                                        $(currentUvEl).removeClass("bg-danger")

                                    }
                                else if (response.value >= 3 & response.value < 8) 
                                    {
                                        $(currentUvEl).addClass("bg-warning")
                                        $(currentUvEl).removeClass("bg-success")
                                        $(currentUvEl).removeClass("bg-danger")
                                    }
                                else if (response.value >= 8) 
                                    {
                                        $(currentUvEl).addClass("bg-danger")
                                        $(currentUvEl).removeClass("bg-warning")
                                        $(currentUvEl).removeClass("bg-success")
                                    }
                            })
                        $("#searchCity").val("")
                        forecast(response.id)
                    }
                    //404 error
                    else 
                    {
                        alert("404 ERROR - PLEASE START OVER");
                        cityArray.pop();
                        console.log(cityArray);
                        localStorage.setItem("storedCities",JSON.stringify(cityArray));
                        cityArray=[];
                        localStorage.clear();
                        document.location.reload();
                    }
            })
}



$("#searchBtn").on("click",displayWeather);
$("#searchBtn").on("click",addToList);
$(document).on("click",changeCity);
$(window).on("load",loadlastCity);
$("#clearBtn").on("click",clearHistory);