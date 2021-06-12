// Storing all the quiz questions, anwers, and extra info
const quiz = {
    noOfQues: 5,
    pointsPerQues: 2,
    quizQues: [
      {
        quesNo: 1,
        quesText: "Which city am I from",
        options: ['Sitapur', 'Lakhimpur', 'Lucknow', 'Allahabad'],
        answer: 'Lucknow',
        metaInfo: 'I was born and brought up in Lucknow, Uttar Pradesh. It has been my home ever since.'

      }, 
      {
        quesNo: 2,
        quesText: "In which month does my birthday fall",
        options: ['May', 'August', 'November', 'October'],
        answer: 'October',
        metaInfo: 'My birthday falls on 10th October.'
      }, 
      {
        quesNo: 3,
        quesText: "Which field am I currently aspiring to have a career in",
        options: ['Artificial Intelligence', 'Cloud Computing', 'Android App Development', 'Web App Development'],
        answer: 'Web App Development',
        metaInfo: 'I\'m currently working on frontend app dev, and transitioning towards backend. I have even taken my current B.Tech minor as MEAN Stack development. Although I\'m quite certain that this stack would not be my goto Web App Dev stack'
      }, 
      {
        quesNo: 4,
        quesText: "Did I take an year drop after finishing 12th standard to prepare for JEE, or any other popular engineering entrance exams",
        options: ['Yes', 'No'],
        answer: 'No',
        metaInfo: 'I was planning to take one and was very much sure about it but, then my mentor told me about the insignificance of an institution\'s tag in one\'s career in long run V/S the precious 1 year of one\'s career going blank.'
      }, 
      {
        quesNo: 5,
        quesText: "Do I prefer playing console games ? If so, then which one",
        options: ['Playstation', 'XBox', 'Nintendo', 'No, I prefer PC/Mobile games'],
        answer: 'Nintendo',
        metaInfo: 'I am into intuitive story lines and evolving gameplay even at the expense of bleeding-edge graphics; So I prefer mainly Nintendo games, even from older generations. Most notable ones would be Pokemon and Zelda games.'
      }
    ]
  };

// npm packages
const readLine = require('readline-sync');
const chalk = require('chalk');
const cFonts = require('cfonts');
const progressBar = require('cli-progress');

// font styles
const myYellow = chalk.hex('f6fba2');
const myBlue = chalk.hex('20ded3');
const pokeRed = chalk.hex('fe5858');
const myYellowAndBlue = chalk.bgHex('f6fba2').hex('20ded3').bold;
// specifies myBlue as font color and myYellow as background color
const myYellowAndRed = chalk.bgHex('f6fba2').hex('fe5858').bold;
// specifies pokeRed as font color and myYellow as background color


// Displaying the blocky heading that says memory quiz
cFonts.say("me-mory|quiz", {
  font: 'tiny',
  align: 'center',
  gradient: '#20ded3,#f6fba2'
});

// Accepting player's name.
let userName;
acceptName();
// Setting default score for new player.
let score = 0;
// Setting initial maxScore for the quiz.
let maxScore = 0;

function acceptName() {
  userName = readLine.question(myYellow.bold("Please enter your name: "));
  /* By pressing any key except 'y', or 'Shift+y', the player can re-enter his/her name;
  whereas pressing either of them will allow the player to confirm his/her name and to continue further.*/
  if(!readLine.keyInYN(myBlue.bold("Are you sure you want to go with "+ myYellowAndBlue.bold(userName)+" as your name ?"))) {
    acceptName();
  }
}

// Utility function made to add an empty line while displaying the output.
function addNewLine() {
  console.log();
}

loadAnimation();

// Used to show the loading animation.
function loadAnimation() {
  // Creating the progress bar which loads for exactly 5 seconds, before displaying further content.
  let loadingAnimation = new progressBar.SingleBar({
      format: myBlue.bold("Loading") +" |"+ myBlue('{bar}') +'| '+ myYellow.bold('{percentage}%'),
      // Progress bar gets printed according to this format, wherein {percentage} would calculate and display percentage of progress done via the {bar} each iteration.
      barIncompleteChar: '\u2591',
      // \u2591 represents the unicode character of Light Shade i.e. ░, which displays the unprogressed section of the bar.
      barCompleteChar: '\u2588',
      // \u2588 represents the unicode character Full Block i.e. █, which displays the progressed section of the bar.
      hideCursor: true,
      // When running this animation, the cursor on shell prompt would be hidden.
    });
  
  // We start the loading animation as soon as 'y' or 'Shift + y' key/s is/are pressed by the player.
  const animStart = setImmediate(()=>{
    loadingAnimation.start(100, 0);
    // The maximum progress of the bar is set to 100 units, and the current progress is set as 0 units.
  });

  // Updates the current progress with 1/5th of the maximum progress after each second
  const unitProgress = 20;
  let currentProgress = 0;
  const animInterval = setInterval(()=> {
    currentProgress+=unitProgress;
    loadingAnimation.update(currentProgress);
  }, 1000);

  // Stopping the animation after approx. 5 seconds after it's start
   const animStop = setTimeout(()=>{
    loadingAnimation.stop();
    clearImmediate(animStart);
    clearInterval(animInterval);
    // After stopping the animation and clearing the timeouts and intervals to improve performance, we welcome the player.
    welcomeUser(animStop);
  }, 5250);
}

function welcomeUser(animStop) {
  addNewLine();
  // Clearing the last residual timeout.
  clearTimeout(animStop);
  let welcomeGreeting = myBlue("Welcome, "+myYellow.italic(userName)+" !");
  console.log(welcomeGreeting);
  // After welcoming the user, the quiz is started.
  startQuiz(score);
}

function startQuiz(score) {
  addNewLine();

  // Displaying Quiz info
  
  console.log(myBlue.italic("* There are a total of "+quiz.noOfQues+" questions"));
  
  console.log(myBlue.italic("* Each question is of "+quiz.pointsPerQues+" point/s"));

  // Calculating maximum score a player can get in the quiz
  maxScore = quiz.pointsPerQues*quiz.noOfQues; 

  /* Asking questions from the 'quiz' to the player.
  Thereafter, updating and displaying the score side by side after each question is answered.
  */
  for(let qNo = 0; qNo < quiz.quizQues.length; qNo++) {
    let currentQues = quiz.quizQues[qNo];
    score += askQuestion(currentQues.quesNo, currentQues.quesText, currentQues.options, currentQues.answer, quiz.pointsPerQues, currentQues.metaInfo, score);
    showScore(score);
  }

  // If player has completed the quiz, answering all the questions correctly
  if (score === maxScore) {
    endQuiz(true, score);
  }
  // Otherwise, if he hasn't answered all the questions in the quiz correctly, the quiz ends with giving him the option to Quit or Retry as well.
  else endQuiz(false, score);
}

// Used to ask each quiz question
function askQuestion(qNo, quesText, options, answer, pointsAwarded, metaInfo, score) {
  // Asking the question to player, along with giving him/her four appropriate options, as well as recording the player's answer
  let ans = readLine.keyInSelect(options, myYellow("Q"+qNo+". "+quesText+" ?"));
  addNewLine();
  
  // Checking if selected answer is the correct one or not 
  if(options[ans] === answer) {
    console.log(myBlue(myYellowAndBlue("Gotcha!"), "That's correct !"));
    addNewLine();
    console.log(myYellow.bold.italic(metaInfo));
    // If player's answer is correct, he gets full points that are specified for that question 
    return pointsAwarded;
  }
  // If player's selected options is not the correct answer
  else {
    // If player selected '0' in order to cancel, his quiz is aborted at the same time
    if(ans === -1) {
      endQuizInMid(score);
    }
    // Otherwise he just chose an incorrect option
    console.log(pokeRed(myYellowAndRed("Oops!") ,"That doesn't sound right."));
    // If player fails to answer the question correctly, he gets 0.
    return 0;
  }
}

// Executes if player quits in the middle of quiz
function endQuizInMid(score) {
  console.log(myBlue("Ending the challenge, so soon :("));
  showGameOver(score);
  console.log(myBlue("Guess I'll see you around "+userName+"!"));
  // Player is given the option to quit the quiz or retry the current level.
  acceptUserChoice('Quit', 'Retry');
}

// Executes after each level completion, when player denies to move to the next level(if given the choice to, in case if there is a next level)
function endQuiz(isCompleted, score) {
  showGameOver(score); 
  // Checking if the player has completed all the levels of quiz or not
  if(!isCompleted) {
    // If he has, then he is given a chance to quit the quiz or retry it
    acceptUserChoice('Quit', 'Retry');
  }
  // If he has completed the quiz, he is automatically exited from the quiz
  else process.exit();
}

// Accepts player's choice for quitting or retrying
function acceptUserChoice(quitChoice, retryChoice) {
  // Giving the appropriate choices to the player, as well as recording the player's choice
  let userChoice = readLine.keyInSelect([quitChoice, retryChoice], myYellow('What do you want to do ?'));
  // If player has chosen to retry, he can restart the quiz.
  if(userChoice === 1) {
    // Restarting quiz
    startQuiz(0);
  }  
  // Or, if he has chosen to quit, then the quiz ends.
  else process.exit();
}

// Used to display the score to the player, after each question
function showScore(points) {
  addNewLine();
  console.log(myYellowAndBlue("Score ==> " + points));
  addNewLine();
}

// Used to check how much a player knows me
function ratePlayerMemory(score) {
  if(score <= 4) {
    console.log(myBlue.bold.italic("Hmmmm. Maybe you don't have a good MEmory."));
  }
  else if(score <= 8) {
    console.log(myBlue.bold.italic("Hey "+userName+", you have an excellent MEmory"));
  }
  else {
    console.log(myBlue.bold.italic("OMG ! "+userName+", Are you a stalker ? Just kidding! But seriousy, you have an outstanding MEmory."));
  }
  addNewLine();
}

// Executes when the quiz is over, i.e. either the player chooses to quit the quiz or a quiz itself gets completed

function showGameOver(points) {
  addNewLine();
  console.log(myYellowAndBlue.bold.underline("Game Over !"));
  addNewLine();
  ratePlayerMemory(points);
  console.log(myBlue("Thank You, for attending this quiz"));
  addNewLine();
  console.log(myBlue("I owe you, your time"));
  addNewLine();
}
