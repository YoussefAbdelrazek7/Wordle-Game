let trueWord;
let anotherTrueWord;
let index = 0;
let trialIndex = 1;
let userWord = "";
let winWord;
let playerStatus = "lose";
let isValid = false;
let allInputs = document.querySelectorAll(".one-word");
let currentTrial = document.querySelectorAll(".trial-1 .one-word");
todaysWord();
allInputs.forEach(function (input) {
  input.disabled = true;
});
document.addEventListener("keydown", function (event) {
  if (trialIndex !== 7 && playerStatus !== "win") {
    if (isLetter(event.key)) {
      currentTrial[index].value = event.key;
      index++;
      if (index > 4) index = 4;
    } else if (event.key === "Enter") {
      validateWord();
    } else if (event.key === "Backspace") {
      backspaceHandler();
    } else {
      event.preventDefault();
    }
  } else alert("Game is Finished");
});
// Functions
async function todaysWord() {
  let promise = await fetch("https://words.dev-apis.com/word-of-the-day");
  let responseObject = await promise.json();
  trueWord = responseObject.word;
  anotherTrueWord = trueWord;
}
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}
function backspaceHandler() {
  if (index === 4 && currentTrial[index].value !== "") {
    currentTrial[index].value = "";
    if (index < 0) index = 0;
  } else {
    index--;
    if (index < 0) index = 0;
    currentTrial[index].value = "";
  }
}
async function validateWord() {
  for (let i = 0; i < 5; i++) {
    userWord += currentTrial[i].value;
  }
  document.getElementById("spinner-container").style.display = "block";
  await valid();
  document.getElementById("spinner-container").style.display = "none";
  if (userWord.length === 5 && isValid === true) {
    winWord = userWord;
    chooseColor();
    if (winWord === trueWord) {
      winHandle();
    }
    nextTrial();
  } else {
    alert("Please Enter a Valid 5 Letters Word");
    userWord = "";
  }
}
function chooseColor() {
  for (let i = 0; i < 5; i++) {
    if (userWord[i] === trueWord[i]) {
      changeColor("green", i);
      userWord = `${userWord.slice(0, i)}${"0"}${userWord.slice(i + 1)}`;
      anotherTrueWord = `${anotherTrueWord.slice(
        0,
        i
      )}${"0"}${anotherTrueWord.slice(i + i)}`;
    }
  }
  for (let i = 0; i < 5; i++) {
    if (isYellow(i)) {
      changeColor("yellow", i);
    } else if (userWord[i] !== "0") {
      changeColor("black", i);
    } else {
    }
  }
}
function nextTrial() {
  trialIndex++;
  if (trialIndex > 6) {
    if (playerStatus !== "win") {
      alert("You Lost, the correct word is: " + trueWord.toUpperCase());
    }
    trialIndex = 7;
  }
  index = 0;
  userWord = "";
  anotherTrueWord = trueWord;
  currentTrial = document.querySelectorAll(`.trial-${trialIndex} .one-word`);
}
function changeColor(color, i) {
  currentTrial[i].style.backgroundColor = color;
  currentTrial[i].style.color = "white";
}
function isYellow(i) {
  for (let j = 0; j < 5; j++) {
    if (
      userWord[i] === anotherTrueWord[j] &&
      userWord[i] !== "0" &&
      anotherTrueWord[j] !== "0"
    ) {
      userWord = `${userWord.slice(0, i)}${"0"}${userWord.slice(i + 1)}`;
      anotherTrueWord = `${anotherTrueWord.slice(
        0,
        j
      )}${"0"}${anotherTrueWord.slice(i + j)}`;
      return true;
    }
  }
  return false;
}
function winHandle() {
  playerStatus = "win";
  document.querySelector("h1").classList.add("win");
  document.querySelector("h2").classList.add("win");
  document.querySelector("h2").style.display = "block";
}
async function valid() {
  let data = {
    word: userWord,
  };
  let promise = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify(data),
  });
  let responseObject = await promise.json();
  responseObject.validWord == true ? (isValid = true) : (isValid = false);
}
