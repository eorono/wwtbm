// ------ Audio variables ------//
let MainThemePlay = new Audio("audio/main theme.mp3");
let wrongPlay = new Audio("audio/wrong.mp3");
let correctPlay = new Audio("audio/correct.mp3");
let callPlay = new Audio("audio/call.mp3");
let fifty50Play = new Audio("audio/5050.mp3");
let audiencePlay = new Audio("audio/audience.mp3");
let inGamePlay = new Audio("audio/64000 music.mp3");

// ------ Selectors --------//
//Start page
let startBox = document.querySelector(".start-box");
let startBtn = document.querySelector(".start-game-btn");
let userInput = document.querySelector(".username");
//Game page
let gameBox = document.querySelector(".game-box");
let timer = document.querySelector(".timer");
let currQuestionAmount = document.querySelector(".current-question-amount");
let lifelineBox = document.querySelector(".life-line-display-box");
let callView = document.querySelector(".call");
let callAnswer = document.querySelector(".call-answer");
let auCover = document.querySelector(".au-cover");
let auBox = document.querySelectorAll(".au-box");
let bx = document.querySelector(".bx");
let questionBox = document.querySelector(".question");
let questionText = document.querySelector(".question-text");
let questionNumber = document.querySelector(".question-number");
let option = document.querySelectorAll(".option");
let optionText = document.querySelectorAll(".opt");
let nextQuestionBtn = document.querySelector(".next-question-btn");
let playAgainBtn = document.querySelector(".playAgain-btn");
let fify50Btn = document.querySelector(".fify50");
let addCancel = document.querySelectorAll(".cancel");
let CallBtn = document.querySelector(".callAFriend");
let askBtn = document.querySelector(".askTheAudience");
let prices = document.querySelector(".prices");
let amountWon = document.querySelector(".amount-won");
// ------ Custom variables ------//
let questionIndex = 0;
let questionIndexStart = 0;
let interval;
let timeLimit;
let quiz = [];
// Window onload event
window.addEventListener("load", () => {
    MainThemePlay.play();
})
// Display question and options
function generateQuestion() {
    questionText.innerHTML = quiz[questionIndex].question;
    optionText[0].textContent = quiz[questionIndex].options[0];
    optionText[1].textContent = quiz[questionIndex].options[1];
    optionText[2].textContent = quiz[questionIndex].options[2];
    optionText[3].textContent = quiz[questionIndex].options[3];
}
// Fetch questions from question.json
fetch("questions.json")
    .then(res => {
        return res.json();
    })
    .then(data => {
        getQuestions(data);
    })
    .catch(error => {
        console.log(error);
    });
// Generate random questions
function getQuestions(data) {
    let rand;
    let count = 0;
    let countMed = 0;
    let countHard = 0;
    while (count < 5) {
        rand = Math.floor(Math.random() * data.easy.length);
        if (!quiz.includes(data.easy[rand])) {
            quiz.push(data.easy[rand]);
            count++;
        }  
    }
    while (countMed < 5) {
        rand = Math.floor(Math.random() * data.medium.length);
        if (!quiz.includes(data.medium[rand])) {
            quiz.push(data.medium[rand]);
            countMed++;
        }  
    }
    while (countHard < 5) {
        rand = Math.floor(Math.random() * data.hard.length);
        if (!quiz.includes(data.hard[rand])) {
            quiz.push(data.hard[rand]);
            countHard++;
        }
    }
    generateQuestion();
}
// Check selected option
function check(ele) {
    let answerCorrect = true;
    let id = parseInt(ele.id);
    if (id == quiz[questionIndex].answer) {
        ele.classList.add("correct");
        correctPlay.play();
        inGamePlay.pause();
        inGamePlay.currentTime = 0;
        answerCorrect = true;
        setTimeout(function () {
           nextQuestion();
        }, 9000);
        if (questionIndex === 14) {
            result();
            correctPlay.pause();
            MainThemePlay.play();
            
        }
    }
    else {
        answerCorrect = false;
        result();
        ele.classList.add("wrong");
        wrongPlay.play();
        inGamePlay.pause();
        inGamePlay.currentTime = 0;
        option.forEach(op => {
            if (op.id == quiz[questionIndex].answer) {
                op.classList.add("show-correct");
            }
        })
        disableAllLifeLines();
        playAgain();
    }
    disableOptions();
    if (questionIndex < 14 && answerCorrect) {
        showNextBtn();
    }
    else {
        disableAllLifeLines();
        playAgain();
    }
    stopTimer();
}
// Time up
function timeIsUp() {
    // showTimeUpText();
    option.forEach(ele => {
        if (parseInt(ele.id) == parseInt(quiz[questionIndex].answer)) {
            ele.classList.add("show-correct");
        }
    })
    result();
    disableOptions();
}
// Start timer
function StartTimer(){
    timeLimit = 30;
    timer.innerHTML = timeLimit;
    timer.classList.remove("less-time");
    interval = setInterval(() => {  
        timeLimit--; 
        if (timeLimit < 10) {
            timeLimit = "0" + timeLimit;
        }
        if (timeLimit < 11) {
            timer.classList.add("less-time");
        }
        timer.innerHTML = timeLimit;
        if (timeLimit == 0) {
            clearInterval(interval);
            timeIsUp();
            playAgain();
        }
    },1000)
   
}
// Stop timer
function stopTimer() {
    clearInterval(interval);
}
// Pause timer
function pauseTimer(remainingTime) {
    parseInt(remainingTime);
    interval = setInterval(() => {  
        remainingTime--; 
        if (remainingTime < 10) {
            remainingTime = "0" + remainingTime;
        }
        if (remainingTime < 11) {
            timer.classList.add("less-time");
        }
        timer.innerHTML = remainingTime;
        if (remainingTime == 0) {
            clearInterval(interval);
            timeIsUp();
            playAgain();
        }
    },1000)

}
// Disable options after selected an option
function disableOptions() {
    option.forEach(ele => {
        ele.classList.add("already-answered");
    });
}
function enableOptions() {
    option.forEach(ele => {
        ele.classList.remove("already-answered");
    });
}
// Disable life line buttons
function disableAllLifeLines() {
    askBtn.style.pointerEvents = "none";
    CallBtn.style.pointerEvents = "none";
    fify50Btn.style.pointerEvents = "none";
}
// Show next question button
function showNextBtn() {  
    /*nextQuestionBtn.classList.add("show");*/
}
// Show play again button
function playAgain() {
    playAgainBtn.classList.add("show");
}
// Hide next question button
function hideNextBtn() {  
    nextQuestionBtn.classList.remove("show");
}
// Next question button event
nextQuestionBtn.addEventListener("click", nextQuestion);
// Next question generate
function nextQuestion() {
    if (questionIndexStart > 0) {
        questionIndex++;
    }
    currentAmount();
    if (questionIndex > 0) {
        removePrevious();
    }
    questionNumber.textContent = `${questionIndex + 1} / ${quiz.length}`;
    currQuestionAmount.textContent = prices.children[14 - questionIndex].childNodes[1].nodeValue;
    questionBox.classList.remove("show");
    option[0].classList.remove("show-1");
    option[1].classList.remove("show-1");
    option[2].classList.remove("show-2");
    option[3].classList.remove("show-2");
    option.forEach(ele => {
        void ele.offsetWidth;
    });
    void questionBox.offsetWidth;
    questionBox.classList.add("show");
    option[0].classList.add("show-1");
    option[1].classList.add("show-1");
    option[2].classList.add("show-2");
    option[3].classList.add("show-2");
    option.forEach(ele => {
        void ele.offsetWidth;
    });
    generateQuestion();
    StartTimer();
    removeStyles();
    hideNextBtn();
    MainThemePlay.pause();
    MainThemePlay.currentTime = 0;
    correctPlay.pause();
    correctPlay.currentTime = 0;
    wrongPlay.pause();
    wrongPlay.currentTime = 0;
    inGamePlay.currentTime = 0;
    inGamePlay.play();
}
// Remove styles
function removeStyles() {
    option.forEach(ele => {
        ele.classList.remove("correct");
        ele.classList.remove("wrong");
        ele.classList.remove("show-correct");
        ele.classList.remove("already-answered");
        ele.style.visibility = "visible";
        lifelineBox.classList.remove("show");
        auCover.classList.remove("show");
        callView.classList.remove("show");
        callAnswer.classList.remove("show");
        playAgainBtn.classList.remove("show");
    })
}
// Reset
function reset() {
    location.reload();
    if (questionIndexStart > 0) {
        questionIndex++;
    }
    if (questionIndex > 0) {
        removePrevious();
    }
    removeStyles();
    MainThemePlay.play();
    lifelineBox.classList.remove("show");
    auCover.classList.remove("show");
    callView.classList.remove("show");
    addCancel[0].classList.remove("show");
    addCancel[1].classList.remove("show");
    addCancel[2].classList.remove("show");
    fify50Btn.style.pointerEvents = "visible";
    CallBtn.style.pointerEvents = "visible";
    askBtn.style.pointerEvents = "visible";
    amountWon.classList.remove("show");
}
// Start button event
startBtn.addEventListener("click", () => {
    if (questionIndex > 0) {
        removePrevious();
    }
    questionIndexStart = 0;
    questionIndex = 0;
    startBox.classList.add("show");
    gameBox.classList.add("show");
    currentAmount();
    nextQuestion();
    MainThemePlay.pause();
    MainThemePlay.currentTime = 0;
    questionIndexStart++;   
});
// Return to home
playAgainBtn.addEventListener("click", () => {
    startBox.classList.remove("show");
    gameBox.classList.remove("show");
    reset();
})
// Disable used life lines
function disableFifty50() {
    addCancel[0].classList.add("show");
    fify50Btn.style.pointerEvents = "none";
}
function disableCall() {
    addCancel[1].classList.add("show");
    CallBtn.style.pointerEvents = "none";
}
function disableAudience() {
    addCancel[2].classList.add("show");
    askBtn.style.pointerEvents = "none";
}
// 50:50 event
fify50Btn.addEventListener("click", function () {
    var rand, second, temp = 0;
    fifty50Play.play();
        while (temp < 1) {
        rand = Math.floor(Math.random() * 4);
        if (parseInt(rand) !== parseInt(quiz[questionIndex].answer)) {
            second = rand;
            temp++;
        }
        }
        option.forEach(ele => {
        if ((parseInt(ele.id) !== parseInt(quiz[questionIndex].answer) && parseInt(ele.id) !== parseInt(option[second].id))){
            ele.style.visibility = "hidden";
        }
        })
    disableFifty50();
})
// Ask the audience event
function askTheAudience() {
    let currentTime = timer.innerHTML;
    timer.innerHTML = currentTime;
    stopTimer();
    lifelineBox.classList.add("show");
    auCover.classList.add("show");
    let rand;
    disableAudience();
    disableOptions();
    let options = {
        "one": [
            {"opt": [0, 20, 10, 70]},
            { "opt": [6, 25, 75, 4]},
            {"opt": [0, 10, 90, 0]}
        ],
        "two": [
            {"opt": [48, 40, 8, 4]},
            { "opt": [2, 52, 43, 2] },
            { "opt": [50, 50, 0, 0]}
        ]
    };
    inGamePlay.pause();
    audiencePlay.play();
    setTimeout(function (){
    if(questionIndex < 8){
        rand = Math.floor(Math.random() * options.one.length);
        options.one[rand].opt.sort((a, b) => b - a);
        var increase = 1;
        auBox.forEach(ele =>{
            if(parseInt(ele.id) === parseInt(quiz[questionIndex].answer)){
                ele.firstChild.textContent = options.one[rand].opt[0] + "%";
                ele.lastChild.style.height = options.one[rand].opt[0] + "%";
            }
            else if(parseInt(ele.id) !== parseInt(quiz[questionIndex].answer)){
                ele.firstChild.textContent = options.one[rand].opt[increase] + "%";
                ele.lastChild.style.height = options.one[rand].opt[increase] + "%";
                increase++;
            }
        })
        }
    else if (questionIndex > 7) {
        rand = Math.floor(Math.random() * options.two.length);
        options.two[rand].opt.sort((a, b) => b - a);
        var increase2 = 1;
        auBox.forEach(ele =>{
            if(parseInt(ele.id) === parseInt(quiz[questionIndex].answer)){
                ele.firstChild.textContent = options.two[rand].opt[0] + "%";
                ele.lastChild.style.height = options.two[rand].opt[0] + "%";
            }
            else if(parseInt(ele.id) !== parseInt(quiz[questionIndex].answer)){
                ele.firstChild.textContent = options.two[rand].opt[increase2] + "%";
                ele.lastChild.style.height = options.two[rand].opt[increase2] + "%";
                increase2++;
            }
        })
    }
        inGamePlay.play();
        pauseTimer(currentTime);
        enableOptions();
    }, 6000);
}
askBtn.addEventListener("click", askTheAudience);
// Call a friend event
function callFriend() {
    let currentTime = parseInt(timer.innerHTML);
    timer.innerHTML = currentTime;
    stopTimer();
    let rand;
    let res = quiz[questionIndex].answer;
    disableCall();
    lifelineBox.classList.add("show");
    callView.classList.add("show");
    let ansCall = {
        "one": ["La respuesta es", "100% seguro que la respuesta es"],
        "two": ["Creo que la respuesta es","No estoy seguro, creo que es" ]
    }
    inGamePlay.pause();
    callPlay.play();
    disableOptions();
    setTimeout(function () {
        if (questionIndex < 8) {
            rand = Math.floor(Math.random() * ansCall.one.length);
            callAnswer.textContent = ansCall.one[rand] + " " + quiz[questionIndex].options[res];
        }
        else if (questionIndex > 7) {
            rand = Math.floor(Math.random() * ansCall.two.length);
            callAnswer.textContent = ansCall.two[rand] + " " + quiz[questionIndex].options[res];
        }
        callAnswer.classList.add("show");
        inGamePlay.play();
        pauseTimer(currentTime);
        enableOptions();
    }, 9000);
}
CallBtn.addEventListener("click", callFriend);
// Current question amount styling
function currentAmount() {
    let count = 14 - questionIndex;
    let child = prices.children[count];
    if (count === 0 || count === 5 || count === 10) {
        child.style.backgroundColor = "gold";
        child.style.color = "#fff";
    }
    else {
        child.style.backgroundColor = "gold";
        child.style.color = "#000";
    }
}
// Remove previous amount styling
function removePrevious() {
    let countPrev = 14 - questionIndex + 1;
    let child = prices.children[countPrev];
    if (countPrev === 0 || countPrev === 5 || countPrev === 10) {
        child.style.backgroundColor = "#000";
        child.style.color = "#fff";
    }
    else {
        child.style.backgroundColor = "#000";
        child.style.color = "gold";
    }   
}
// Amount Won
function result() {
    auCover.classList.remove("show");
    callView.classList.remove("show");
    if (questionIndex < 4) {
        lifelineBox.classList.add("show");
        amountWon.classList.add("show");
        amountWon.innerHTML = "No lograste asegurar";
    }
    else if (questionIndex >= 4 && questionIndex < 9) {
        lifelineBox.classList.add("show");
        amountWon.classList.add("show");
        amountWon.innerHTML = "Aseguraste premio";
    }
    else if (questionIndex >= 9 && questionIndex < 14) {
        lifelineBox.classList.add("show");
        amountWon.classList.add("show");
        amountWon.innerHTML = "Aseguraste premio";
    }
    else if (questionIndex >= 14) {
        lifelineBox.classList.add("show");
        amountWon.classList.add("show");
        amountWon.innerHTML = "Aseguraste premio";
    }
}
