var endDate = new Date("2022/10/14 18:00:00")
var startDate = new Date("2022/10/07 18:00:00")
var length = endDate - startDate;

function updateClock() {
    let now = new Date();
    let timeLeft = convertMS(endDate - now);
    let percents = (100 - 100 * (endDate - now) / length).toFixed(2);

    document.getElementById("time_div").innerHTML = percents + "% passed<br>" +
                                                    "Time left:<br>" +
                                                    timeLeft.day + " days<br>" +
                                                    timeLeft.hour + " hours<br>" +
                                                    timeLeft.minute + " minutes<br>" +
                                                    timeLeft.seconds + " seconds<br>";
}
setInterval(updateClock, 1000);

function convertMS(milliseconds) {
    var day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
        day: day,
        hour: hour,
        minute: minute,
        seconds: seconds
    };
}
