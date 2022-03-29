// Global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1500; //how long to wait before starting playback of the clue sequence


// Global Variables
var pattern = [2, 4, 6, 3, 2, 1, 5, 4];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;
var clueHoldTime = 1500; //how long to hold each clue's light/sound
var mistakes = 0;
var interval;
var basicMode = false;
var repeat = false;

// Generate a random pattern
function generatePattern(){
  return Math.floor(Math.random() * 6 + 1);
}

function startGame(){
  // Initialize game variables
  progress = 0;
  mistakes = 0;
  updateMistakes();
  gamePlaying = true;
  document.getElementById("timer").innerHTML = "Timer: 0:00";
  if(basicMode == true){
    clueHoldTime = 1000;
  }else{
    clueHoldTime = 1500;
  }
  
  // Create random pattern
  pattern = [generatePattern(), generatePattern(), generatePattern(), generatePattern(), generatePattern(), generatePattern(), generatePattern(), generatePattern()];
  
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  
  playClueSequence();
}

function stopGame(){
  gamePlaying = false;
  clearInterval(interval);;
  
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function lightButton(btn){
  if(basicMode == true){
    document.getElementById("basicButton"+btn).classList.add("lit");
  }else{
    document.getElementById("button"+btn).classList.add("lit");
  }
}
function clearButton(btn){
  if(basicMode == true){
    document.getElementById("basicButton"+btn).classList.remove("lit");
  }else{
    document.getElementById("button"+btn).classList.remove("lit");
  }
}

function updateMistakes(){
  document.getElementById("paragraphMistakes").innerHTML=('Number of mistakes: ' + mistakes);
}

function playTone(sound){
  document.getElementById(sound).currentTime=0;
  document.getElementById(sound).play();
  setTimeout(() => {document.getElementById(sound).pause();}, clueHoldTime);
  tonePlaying = true; 
}

function stopTone(sound){
  document.getElementById(sound).pause();
  tonePlaying = false;
}

function soundID(btn){
  if(btn == 1){
    return "catSound";
  }
  if(btn == 2){
    return "dogSound";
  }
  if(btn == 3){
    return "catSound";
  }
  if(btn == 4){
    return "dogSound";
  }
  if(btn == 5){
    return "rabbitSound";
  }
  if(btn == 6){
    return "owlSound";
  }
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    if(basicMode == true){
      basicPlayTone(btn,clueHoldTime);
    }else{
      playTone(soundID(btn));
    }
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function setTimer(){
  console.log("set timer");
  var minute = 0;
  var sec = 15;
  if(interval){
    clearInterval(interval);
  }
  interval = setInterval(function(){
    if(sec < 10){
      var secPrint = "0" + sec;
    }else{
      secPrint = sec;
    }
    document.getElementById("timer").innerHTML = "Timer: " + minute + " : " + secPrint;
    sec--;
    if (sec == 0) {
      if (minute == 0) {
        loseGame();
        return;
      } 
      minute --;
      sec = 60;
    }
  }, 1000);
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue,delay,pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
  if(gamePlaying){
  setTimeout(setTimer,delay);
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
  document.getElementById("timer").innerHTML = "Timer: 0:00";
}
function winGame(){
  stopGame();
  document.getElementById("fireworkGif").classList.remove("hidden");
  setTimeout(function(){document.getElementById("fireworkGif").classList.add("hidden")},3000);
  alert("Game Over. You win!");
}

// Shows a X on the wrong click
function wrongClick(btn){
  var button;
  var rect;
  const xImg = document.getElementById("xImg");
  if(basicMode == true){
    button = document.getElementById("basicButton"+btn); 
  }else{
    button = document.getElementById("button"+btn);
  }

  
  var rect = button.getBoundingClientRect();
  console.log(rect.top, rect.right, rect.bottom, rect.left);
  xImg.style.top = (rect.top + window.scrollY) + 'px'; 
  xImg.style.left = (rect.left + window.scrollX) + 'px'; 
  xImg.classList.remove("hidden")
  setTimeout(function(){xImg.classList.add("hidden")},1000);
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  // If guess is incorrect
  if(btn != pattern[guessCounter]){
    wrongClick(btn);
    
    // Resets timer if repeat is on
    if(repeat == true){clearInterval(interval);}
    
    mistakes ++;
    updateMistakes();
    if(mistakes == 3){
      loseGame();
    }else if(repeat == true){
      // Show the sequence again if repeat is on
      playClueSequence();
    }
    return;
  }
  // If guess is correct and at the last sequence
  if(guessCounter == progress){
    // If we are at the last round
    if(progress == pattern.length - 1){
      winGame();
    }else{
      clearInterval(interval);
      progress ++;
      clueHoldTime -= 100;
      playClueSequence();
    }
  }else{
  // If guess is correct but not at the last sequence yet
  guessCounter ++;
  }
}

 
// Functions for basic mode
function changeToBasic(){
  stopGame();
  basicMode = true;
  
  // swap the pet mode and basic mode titles and descriptions
  document.getElementById("title").classList.add("hidden");
  document.getElementById("description").classList.add("hidden");
  document.getElementById("basicTitle").classList.remove("hidden");
  document.getElementById("basicDescription").classList.remove("hidden");
  
  // swap the pet mode and basic mode buttons
  document.getElementById("gameButtonArea").classList.add("hidden");
  document.getElementById("basicGameButtonArea").classList.remove("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 422.2,
  5: 458,
  6: 489.2
}

function basicPlayTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    basicStopTone()
  },len)
}

function basicStartTone(btn){
  if(!tonePlaying){
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025);
    context.resume();
    tonePlaying = true;
  }
}

function basicStopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)


function changeToPet(){
  stopGame();
  basicMode = false;
  
  // swap the pet mode and basic mode titles and descriptions
  document.getElementById("title").classList.remove("hidden");
  document.getElementById("description").classList.remove("hidden");
  document.getElementById("basicTitle").classList.add("hidden");
  document.getElementById("basicDescription").classList.add("hidden");
  
  // swap the pet mode and basic mode buttons
  document.getElementById("gameButtonArea").classList.remove("hidden");
  document.getElementById("basicGameButtonArea").classList.add("hidden");
}


// Settings
function turnIcon(){
  document.getElementById("settingsIcon").classList.add("fa-spin");
}
function stopIcon(){
  document.getElementById("settingsIcon").classList.remove("fa-spin");
}

function openSettings() {
  document.getElementById("popup").classList.add("active");
}
function closeSettings() {
  document.getElementById("popup").classList.remove("active");
}

function select(ID) {
  document.getElementById(ID).style.background='#B6DDFF';
}
function unselect(ID) {
  document.getElementById(ID).style.background='white';
}

// Repeat settings
function repeatOn(){
  stopGame();
  repeat = true;
}
function repeatOff(){
  stopGame();
  repeat = false;
}