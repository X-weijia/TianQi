$(function () {
    //语音播报
    $(".audiobtn").click(function (event) {
        event.stopPropagation();
        let speech = window.speechSynthesis;
        let speechset = new SpeechSynthesisUtterance();
        let text = $("header span").text() + "当前温度" + $("#current_temperature").text() + "摄氏度" + $("#current_condition").text() + "当前风向" + $("#wind_direction").text() + $("#wind_level").text() + "级";

        speechset.text = text;
        speech.speak(speechset);
    })


    let citys;
    $.ajax({
        url: "https://www.toutiao.com/stream/widget/local_weather/city/",
        type: "get",
        dataType: "jsonp",
        success: function (e) {
            citys = e.data;
            let str = "";
            for (key in citys) {
                str += `<h2>${key}</h2>`;
                str += `<div class="con">`
                for (key2 in citys[key]) {
                    str += `<div class="city">${key2}</div>`
                }
                str += `</div>`
            }
            $(str).appendTo($(".cityBox"))
        }
    })

    let cityBox = $(".cityBox");
    let header = $("header");
    let btn = $(".cityBox .search .btn")
    // console.log(cityBox, header);
    header.click(function () {
        cityBox.slideDown();
    })
    btn.click(function () {
        cityBox.slideUp();
    })
    cityBox.on("touchstart", function (event) {
        if (event.target.className == "city") {
            let city = event.target.innerText;
            $.ajax({
                url: "https://www.toutiao.com/stream/widget/local_weather/data/",
                data: { 'city': city },
                type: "get",
                dataType: "jsonp",
                success: function (e) {
                    update(e.data);
                    console.dir(e.data)
                }
            })

            cityBox.slideUp();

        }
    })

    $.ajax({
        url: "https://www.toutiao.com/stream/widget/local_weather/data/",
        data: { 'city': "太原" },
        type: "get",
        dataType: "jsonp",
        success: function (e) {
            update(e.data);
            console.dir(e.data)
        }
    })
})
function update(data) {
    // console.log(data)
    $("header span").text(data.city);
    $("#current_temperature").text(data.weather.current_temperature);
    $("#current_condition").text(data.weather.current_condition);
    $("#wind_direction").text(data.weather.wind_direction);
    $("#wind_level").text(data.weather.wind_level);
    $("#aqi").text(data.weather.aqi);
    $("#quality_level").text(data.weather.quality_level);
    $("#high_temperature").text(data.weather.high_temperature);
    $("#low_temperature").text(data.weather.low_temperature);
    $("#tomorrow_high_temperature").text(data.weather.tomorrow_high_temperature);
    $("#tomorrow_low_temperature").text(data.weather.tomorrow_low_temperature);
    $("#day_condition").text(data.weather.day_condition);


    let str = "";
    for (obj of data.weather.hourly_forecast) {
    str += `
    <div class="box">
        <div><span>${obj.hour}</span>:00</div>
        <img src="img/${obj.weather_icon_id}.png" alt="">
        <div><span>${obj.temperature}</span>°</div>
    </div>`
}
$(".hours .con").html(str)


let str1 = "";
let high = [];
let low = [];
let x = [];

let weeknum = ["日", "一", "二", "三", "四", "五", "六"]
for (obj of data.weather.forecast_list) {
    let date = new Date(obj.date);
    let day = date.getDay();   //星期几   0 1 2 3 4 5 6
    let month = (obj.date).slice(5, 7);
    let month1 = (obj.date).slice(8, 10);
    x.push(day);
    high.push(obj.high_temperature);
    low.push(obj.low_temperature);
    str1 += `
    <div class="box">
        <span>星期${weeknum[day]}</span>
        <div style="margin:0.1rem 0 0.2rem 0;"><span>${month}</span>/<span>${month1}</span></div>
        <span>多云</span>
        <img src="img/${obj.weather_icon_id}.png" alt="">
        <div>${obj.high_temperature}°</div>
        <div style="margin-top:3rem;">${obj.low_temperature}°</div>
        <img src="img/${obj.weather_icon_id}.png" alt="">
        <div><span>${obj.condition}</span></div>
        <div style="margin:0.1rem 0 0.2rem 0;"><span>${obj.wind_direction}</span></div>
        <span>${obj.wind_level}级</span>
    </div>`
}
$(".week .con").html(str1)

// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init($(".week .canvas")[0]);
// 指定图表的配置项和数据
var option = {
    xAxis: {
        data: x,
        show: false
    },
    grid: {
        left: 0,
        right: 0
    },
    yAxis: {
        show: false
    },
    series: [{
        name: "最高气温",
        type: "line",
        data: high
    }, {
        name: "最低气温",
        type: "line",
        data: low
    }
    ]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);
}



