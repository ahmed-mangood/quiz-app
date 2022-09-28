// Select Elements From Html
let countDiv = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-button");
let resultSec = document.querySelector(".results");
let countDownElement = document.querySelector(".countdwon");
let startBtn = document.querySelector(".start");
let reloadBtn = document.querySelector(".reload");
// cuurnet number to strat from it
let currentNum = 0;
let theRightAnswer = 0;
let countDownInterval;
/*  Function To Get Data From Json File And Set This Data On Object */
function get_data() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObj = JSON.parse(this.responseText); 
            let questionsLength = questionsObj.length;
            questionsNum(questionsLength);
            addQuestionsData(questionsObj[currentNum], questionsLength);
            // // CountDown Run
            countDown(30, questionsLength);
            // on SubmitButton click 
            submitBtn.onclick = () => {
                if (currentNum < questionsLength) {
                    let  theRightAnswer = questionsObj[currentNum].the_right_answer;
                    currentNum++;
                    checkAnswer(theRightAnswer, questionsLength);
                    // Remove Previous Question
                    quizArea.innerHTML = '';
                    answersArea.innerHTML = '';
                    addQuestionsData(questionsObj[currentNum], questionsLength);
                    // handle Bullets of Questions
                    handleBullets();
                     // CountDown Run
                    clearInterval(countDownInterval);
                    countDown(30, questionsLength);
                    // show the results of questions
                    showResults(questionsLength);
                }
            }
        }
    }
    myRequest.open("GET", "questions.json", true);
    myRequest.send();
}
// make start button run one time and do some animations
startBtn.addEventListener("click", killClick);
function killClick() {
    get_data();
    startBtn.style.cursor = "no-drop";
    countDownElement.style.opacity = "1";
    countDownElement.style.transition = "2s";
    quizArea.style.opacity = "1";
    quizArea.style.transition = "1s";
    quizArea.style.padding = "20px";
    answersArea.style.opacity = "1";
    answersArea.style.transition = "1s";
    answersArea.style.padding = "20px";
    bullets.style.padding = "15px";
    bullets.style.transition = "1s";
    startBtn.removeEventListener("click", killClick);
}
// reload button if user need to run quiz again 
reloadBtn.onclick = function() {
    window.location.reload();
}
/* function to add numbers of questions in page */
function questionsNum(num) {
    countDiv.innerHTML = num;
    // Create Span
    for(let i = 0; i < num; i++) {
        let bulletsSpan = document.createElement("span");
        if(i === 0) {
            bulletsSpan.className = 'on';
        }
        bulletsContainer.appendChild(bulletsSpan);
    }
}
/* function to add questions data from jsonObject to the page */
function addQuestionsData(obj, count) {
    if(currentNum < count) {
        // Create Heading Of Questions
        let QuestionsTitle = document.createElement("h2");
        let questionsText = document.createTextNode(obj.title);
        // Append Title To Heading
        QuestionsTitle.appendChild(questionsText);
        quizArea.appendChild(QuestionsTitle);
        // Create Answers
        for(let i = 1; i <= 4; i++) {
            // Create main div
            let mainDiv = document.createElement("div");
            mainDiv.className = "answer";
            // create radio input
            let radioInput  = document.createElement("input");
            radioInput.type = "radio";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];
            radioInput.name = "questions";
            if(i === 1) {
                // radioInput.setAttribute("checked", ""); /* another way to make the same output but it's not liked */
                radioInput.checked = true;
            }
            // create Label tag and (for="") attribute then make the answers the values of (for="")
            let thelabel = document.createElement("label");
            thelabel.htmlFor = `answer_${i}`;
            // create labelText and append it to label tag
            let labelText = document.createTextNode(obj[`answer_${i}`]);
            thelabel.appendChild(labelText);
            // Append radioinput and label to main div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(thelabel);
            // Append main div to answer Areia
            answersArea.append(mainDiv);
        }
    }
}
// this function make a check if the choosen answer the right answer or not 
function checkAnswer(rightAns, count) {
    let answers = document.getElementsByName("questions");
    let choosenAnswer;
    for(let i = 0; i < answers.length; i++) {
        
        if(answers[i].checked) {
            choosenAnswer = answers[i].dataset.answer;
        }
    }
    if(rightAns === choosenAnswer) {
        theRightAnswer++;
    }
}
// the bullets will take the class on if user answer the quistion to know him what the number of quistion he answer
function handleBullets() {
    let bullets = document.querySelectorAll(".bullets .spans span");
    let bulletsArray = Array.from(bullets);

    bulletsArray.forEach((span, index) => {
        if(currentNum === index) {
            span.className = 'on';
        }
    });
}
// if user finish the quiz then the result message show the progress of the quiz
function showResults(count) {
    let theResults;
    if(currentNum === count) {
        quizArea.remove();
        answersArea.remove();
        submitBtn.remove();
        bullets.remove();
        if(theRightAnswer > count / 2 && theRightAnswer < count) {
            theResults = `The Result : <span class="good">Good </span>Your Progress is ${theRightAnswer} From ${count}`;
        } else if (theRightAnswer === count) {
            theResults = `The Result : <span class="perfect">Perfect </span>Your Progress is ${theRightAnswer} From ${count}`;
        } else {
            theResults = `<span class="bad">Your Progress is ${theRightAnswer} From ${count} You Should Try Again !</span>`;
        }
        resultSec.innerHTML = theResults;
    }
}
// function to make count down for every question have 30 seconds ..
function countDown(duration, count) {
    if(currentNum < count) {
        let minutes, seconds;
        countDownInterval = setInterval(function () {

            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            
            minutes = minutes < 10 ? `0${minutes}`: `${minutes}`;
            seconds = seconds < 10 ? `0${seconds}`: `${seconds}`;

            countDownElement.innerHTML = `${minutes}:${seconds}`;
            
            if(--duration < 0) {
                clearInterval(countDownInterval);
                submitBtn.click();
            }
        }, 1000)
    }
}
// ===================================== <<<< I Will Make Updates In The Future :) >>>> ============================ //