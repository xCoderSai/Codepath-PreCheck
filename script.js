const clueHoldTime = 500;
var cluePauseTime = 500; //how long to pause in between clues
const nextClueWaitTime = 500; //how long to wait before starting playback of the clue sequence


var pattern=[];
var progress = 1; 
var gamePlaying = false;

var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0

var guessCounter = 0;

var lives = 3;

var gameLength = 2;

/*
let countdown;
let seconds;
function timer() {
  clearInterval(countdown);
  var seconds = 10;
  var countdown = setInterval(function() {
  seconds--;
  document.getElementById("time").textContent = seconds;
  if (seconds <= 0){
    clearInterval(countdown);
    loseLife();
  }
}, 1000);
  
}
function stopTimer() {
  seconds = 0;
  clearInterval(countdown);
}
*/

function getInput() {
  gameLength = document.getElementById("numInput").value;
}
function defPattern() {
  for(var itr=0; itr<=gameLength; itr++) {
    pattern[itr] = Math.floor(Math.random() * (4) + 1);  
  }
  console.log(pattern);
}

function startGame() {
//  stopTimer();
  document.getElementById("livesHTML2").innerHTML = lives;
  document.getElementById("livesHTML").classList.remove("hidden");
  progress = 0;
  gamePlaying = true;
  document.getElementById("btnStart").classList.add("hidden");
  document.getElementById("btnStop").classList.remove("hidden");
  document.getElementById("replay").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("btnStart").classList.remove("hidden");
  document.getElementById("btnStop").classList.add("hidden");
  document.getElementById("replay").classList.add("hidden");
//  stopTimer();
}
const freqMap = {
  1: 131, //different octaves of "C"
  2: 262,
  3: 523,
  4: 1047
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
  
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}
function replay() {
  playClueSequence();
}

function playClueSequence(){
  document.getElementById("progressHTML").innerHTML = progress + "/" + gameLength;
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
//  timer();
}
function showStart() {
  document.getElementById("btnStart").classList.remove("hidden");
}
function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You won!");
}

function loseLife() {
  if (lives==0){
    loseGame();
  }
  lives--;
  document.getElementById("livesHTML2").innerHTML = lives;
  playClueSequence();
}

function guess(btn) { 
//  stopTimer();
  if(lives==1) {
    document.getElementById("livesHTML2").innerHTML = 0;
    loseGame();
    document.getElementById("replay").classList.add("hidden");
  }
  console.log("user guessed:  " + btn)
  if (!gamePlaying) {
    return;
  }
  
  var isCorrect = Boolean(pattern[guessCounter] == btn);
  
  if(isCorrect) {
    if(guessCounter == progress) {
      if(progress == pattern.length - 1){ // every tile revealed
        winGame();
      } 
      else { // game still in progress, add onto sequence
        cluePauseTime *=.75; //faster each time
        progress++;
        playClueSequence();
      }
    }
    else {
      guessCounter++;
    }
  }
  else {
    //Guess was incorrect
    //GAME OVER: LOSE!
    
    if (lives>0) {
      loseLife();
    }
    else 
      loseGame();
  }
  
  
};