let miliSec = document.getElementById('mili-sec')
let stopBtn = document.getElementById('stop')
let startBtn = document.getElementById('start')
let secondDiv = document.getElementById('seconds')
let minutesDiv = document.getElementById('minutes')
let resetBtn = document.getElementById('reset')
let time = {"min":0, "sec":0, "msec":0}
let myInterval;
startBtn.onclick = () => {
   myInterval = setInterval(startTime, 10);
}
stopBtn.onclick = () => {
    stopTime()
}
resetBtn.onclick = () => reset()
let timeStamp;
function startTime(){
    time["msec"] += 1
    if (time["msec"] == 100){
        time["sec"] += 1
        time["msec"] = 0
       
    } if (time["sec"] == 60){
            time["min"] += 1
            time["sec"] = 0
    }
    miliSec.innerText = time["msec"]
    secondDiv.innerText = time["sec"]
    minutesDiv.innerText = time["min"]
}

function stopTime(){
    clearInterval(myInterval)
}

function reset(){
    clearInterval(myInterval)
    miliSec.innerText = 0
    secondDiv.innerText = 0
    minutesDiv.innerText = 0
    time["sec"] = 0
    time["msec"] = 0
    time["min"] = 0
}