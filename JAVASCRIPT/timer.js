let timer = {"min":0, "sec":0}

//get access to the buttons
let userInput = document.getElementById('set-time')
let secBtn = document.getElementById('seconds-button')
let minBtn = document.getElementById('minute-button')
let startBtn = document.getElementById('start')
let resetBtn = document.getElementById('reset')
startBtn.disabled = true;

//get access to the divs
let minuteDiv = document.getElementById('minutes')
let secondDiv = document.getElementById('seconds')
let msgDiv = document.getElementById('message')
let body = document.getElementsByTagName('body')[0];
let aud = document.getElementById('anya')

secBtn.onclick = () => {
    if(Number(userInput.value) >= 60 || Number(userInput.value)<0){
        msgDiv.innerText = "Invalid Input"
    }else{
        timer["sec"] += Number(userInput.value)
        startBtn.disabled = false
    }
    minuteDiv.innerText = timer["min"]
    secondDiv.innerText = timer["sec"]
    userInput.value = ""
}

minBtn.onclick = () => {
    if (Number(userInput.value) < 0){
        msgDiv.innerText = "Invalid Input"
    }else{
        timer["min"] += Number(userInput.value)
        startBtn.disabled = false
    }
    minuteDiv.innerText = timer["min"]
    secondDiv.innerText = timer["sec"]
    userInput.value = ""
}

// make the start button functioning
let myInterval;
startBtn.onclick = () => {
    myInterval = setInterval(startTimer, 1000)
    resetBtn.disabled = true;
}
resetBtn.onclick = () => {
    timer["min"] = 0
    timer["sec"] = 0
    body.style.backgroundColor = "lime"
    msgDiv.innerText = ""
    startBtn.disabled = true
}
function startTimer(){
    if (timer["sec"] == 0){
        timer["min"] -= 1
        timer["sec"] = 60
    }
    timer["sec"] -= 1
    if (timer["sec"] == 0 && timer["min"] == 0){
        msgDiv.innerHTML = "<img src='Heh.gif' style='width:300px; height:300px'>"
        clearInterval(myInterval)
        body.style.backgroundColor = "red"
        startBtn.disabled = true
        resetBtn.disabled = false
        aud.play();
        
    }
    minuteDiv.innerText = timer["min"]
    secondDiv.innerText = timer["sec"]
}
