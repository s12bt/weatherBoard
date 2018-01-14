$(function(){
  showCalender();
  showTodayWeather();
  showTimelineWeather();
  
  setInterval(showCalender, 1000);
  setInterval(showTodayWeather, 1000 * 60 * 60);
  setInterval(showTimelineWeather, 1000 * 60 * 60);
  
  /* for debug */
  $('#btnReload').click(function(){
    location.reload();
  })
});

// GET YOUR API KEY & CITY ID
// https://openweathermap.org/
const APIkey = 'YOUR API KEY';
const city = 'CITY ID';

const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

function showupdateTime() {
  let updateDate = new Date().toLocaleString();
  $('#btnReload').text(updateDate);
}

function showCalender(){
  let nowDate = new Date();
  $('#calMon').text(nowDate.getMonth() + 1);
  $('#calDate').text(nowDate.getDate());
  $('#calDay').text(week[nowDate.getDay()]);

  let HH = nowDate.getHours();
  if(HH < 10) {
    HH = '0' + HH;
  }
  $('#clockHH').text(HH);

  let MM = nowDate.getMinutes();
  if(MM < 10) {
    MM = '0' + MM;
  }
  $('#clockMM').text(MM);
}

function showTodayWeather(){
  const url = 'http://api.openweathermap.org/data/2.5/weather?id=' + city + '&units=metric&APPID=' + APIkey;
  $.ajax({
    url: url,
    dataType: "json",
    type: 'GET'
  })
  .done(function(res){
    /* icon */
    let iconClassName = 'wi-owm-' + res.weather[0].id;
    $('#todayWeatherIcon').removeClass().addClass('wi ' + iconClassName);

    /* weather label */
    let weatherName = res.weather[0].main;
    $('#todayWeatherText').text(weatherName);

    /* meta */
    $('#todayWeatherTemp').text(Math.round(res.main.temp));
    $('#todayWeatherClouds').text(res.clouds.all);

    showupdateTime();
  })
  .fail(function(res){
    $('#todayWeatherIcon').removeClass().addClass('wi wi-na');
    $('#todayWeatherText').text('Error:' + res.responseJSON.cod);
  })
}

function showTimelineWeather(){
  const url = 'http://api.openweathermap.org/data/2.5/forecast?id=' + city + '&units=metric&APPID=' + APIkey;
  $.ajax({
    url: url,
    dataType: "json",
    type: 'GET'
  })
  .done(function(res){
    const data_list = res.list;
    let timeline_list = []; // array for timeline display data
    
    const today = new Date();
    
    let timeline_6 = {};
    let timeline_6_dateObj = new Date();
    timeline_6_dateObj.setHours(6, 0, 0);
    timeline_6_dateObj = Math.floor(timeline_6_dateObj.getTime() / 1000);
    timeline_6.time = timeline_6_dateObj;
    timeline_list.timeline_6 = timeline_6;
  
    let timeline_12 = {};
    let timeline_12_dateObj = new Date();
    timeline_12_dateObj.setHours(12, 0, 0);
    timeline_12_dateObj = Math.floor(timeline_12_dateObj.getTime() / 1000);
    timeline_12.time = timeline_12_dateObj;
    timeline_list.timeline_12 = timeline_12;
  
    let timeline_18 = {};
    let timeline_18_dateObj = new Date();
    timeline_18_dateObj.setHours(18, 0, 0);
    timeline_18_dateObj = Math.floor(timeline_18_dateObj.getTime() / 1000);
    timeline_18.time = timeline_18_dateObj;
    timeline_list.timeline_18 = timeline_18;
  
    let timeline_24 = {};
    let timeline_24_dateObj = new Date();
    timeline_24_dateObj.setDate(today.getDate() + 1);
    timeline_24_dateObj.setHours(0, 0, 0);
    timeline_24_dateObj = Math.floor(timeline_24_dateObj.getTime() / 1000);
    timeline_24.time = timeline_24_dateObj;
    timeline_list.timeline_24 = timeline_24;
  
    let timeline_tomorrow = {};
    let timeline_tomorrow_dateObj = new Date();
    timeline_tomorrow_dateObj.setDate(today.getDate() + 1);
    timeline_tomorrow_dateObj.setHours(6, 0, 0);
    timeline_tomorrow_dateObj = Math.floor(timeline_tomorrow_dateObj.getTime() / 1000);
    timeline_tomorrow.time = timeline_tomorrow_dateObj;
    timeline_list.timeline_tomorrow = timeline_tomorrow;
    
    for (line in timeline_list) {
      var timeline_item = timeline_list[line];
      
      for (data in data_list) {
        if(data_list[data].dt === timeline_item.time) {
          timeline_item.clouds = data_list[data].clouds.all;
          timeline_item.main = data_list[data].main;
          timeline_item.weather = data_list[data].weather[0];
  
          localStorage.setItem(line, JSON.stringify(timeline_item));
        }
      }
    }
    
    for (item in timeline_list) {
      let iconID = item + '_icon';
      let cloudID = item + `_cloud`;
      
      if('clouds' in timeline_list[item]) {
        $('#' + iconID).removeClass().addClass('wi wi-owm-' + timeline_list[item].weather.id);
        $('#' + cloudID).text(timeline_list[item].clouds);
        
      } else if(localStorage.getItem(item)) {
        var localData = JSON.parse(localStorage.getItem(item));
        $('#' + iconID).removeClass().addClass('wi wi-owm-' + localData.weather.id);
        $('#' + cloudID).text(localData.clouds);
        
      } else {
        $('#' + iconID).removeClass().addClass('wi wi-na');
        $('#' + cloudID).text('--');
      }

    }
  })
  .fail(function(res){
    $('.timeline__icon i').removeClass().addClass('wi wi-na');
    $('.timeline__cloudy span').text('--');
  })
}
