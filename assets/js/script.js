var apiKey = "f31a9d61dacf5cd49a41c23a8bd6acbf";

$('#search-btn').on('click', function() {
    var location = $("#search-text").val()
    // console.log(location)
    // console.log('clicked')
    if(location) {
        weatherReport(location)
    } else {
        alert('City doesnt exist!')
    }
})

function weatherReport(city) {
    var location = city
    // console.log(location)
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=imperial&daily.uvi&appid=" + apiKey;
    
    fetch(apiUrl)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data)
                var cityId = data.id
                var lat = data.coord.lat
                var lon = data.coord.lon
                var oneCallApi = 'https://api.openweathermap.org/data/2.5/onecall?lat='+ lat +'&lon='+ lon +'&units=imperial&appid=' + apiKey

                localStorage.setItem(cityId, location);

                $('#cityname').text(data.name)
                $('#weather-date').text(new Date(data.dt * 1000).toLocaleDateString("en-US"));
                $('#weathericon').attr('src', 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '.png');
                $('#temp').text(data.main.temp + 'F');
                $('#wind').text(data.wind.speed + 'MPH');
                $('#humidity').text(data.main.humidity + '%');

                fetch(oneCallApi).then(function (res) {
                    if (res.ok) {
                        res.json().then(function (data) {
                            // console.log(data)
                            if (data.daily[0].uvi < 3) {
                                $('#uv-index').text(data.daily[0].uvi).removeClass().addClass('bg-success')
                            } else if (data.daily[0].uvi > 3 && data.daily[0].uvi < 6) {
                                $('#uv-index').text(data.daily[0].uvi).removeClass().addClass('bg-primary rounded')
                            } else if (data.daily[0].uvi > 6 && data.daily[0].uvi < 8) {
                                $('#uv-index').text(data.daily[0].uvi).removeClass().addClass('bg-warning rounded')
                            } else {
                                $('#uv-index').text(data.daily[0].uvi).removeClass().addClass('bg-danger rounded')
                            }

                            for (i = 0; i < data.daily.length; i++) {
                                $('.forcast-icon').eq(i).attr('src', 'http://openweathermap.org/img/wn/'+ data.daily[i].weather[0].icon + '.png');
                                $('.forcast-temp').eq(i).text(data.daily[i].temp.day + 'F');
                                $('.forcast-wind').eq(i).text(data.daily[i].wind_speed + 'MPH');
                                $('.forcast-humidity').eq(i).text(data.daily[i].humidity + '%');
                                $('.date').eq(i).text(new Date(data.daily[i].dt * 1000).toLocaleDateString("en-US"))
                            }

                        })
                    }
                })
            })
        } else {
            console.log('error')
        }
    })
}   

$('.btncity').on('click', function(event) {
     var clickedBtn = event.target.innerHTML;
     if (clickedBtn) {
        weatherReport(clickedBtn)
     }
})

function cityStorage() {
    for (i = 0; i < localStorage.length; i++) {
        var city = localStorage.getItem(localStorage.key(i))
        //console.log(city);
        var citybtn = document.createElement('button');
        var pastCity = document.querySelector('.city');
        pastCity.appendChild(citybtn);
        citybtn.classList.add('btncity');
        citybtn.innerHTML = city;
    }
}


cityStorage();