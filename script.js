const choices = ["rock", "paper", "scissors"];
const buttons = document.querySelectorAll(".choice");
const resultDiv = document.getElementById("result");
const scoreDiv = document.getElementById("score");
const timerDiv = document.getElementById("timer");
const historyUl = document.getElementById("history");

let userScore = 0;
let computerScore = 0;
let timer;
let countdown;

loadScores();

buttons.forEach(button => {
  button.addEventListener("click", () => {
    clearInterval(countdown);
    playRound(button.dataset.choice);
  });
});

function playRound(playerChoice) {
  const computerChoice = choices[Math.floor(Math.random() * 3)];
  let result = "";

  if (playerChoice === computerChoice) {
    result = "Draw!";
  } else if (
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "paper" && computerChoice === "rock") ||
    (playerChoice === "scissors" && computerChoice === "paper")
  ) {
    userScore++;
    result = `You Win! ${playerChoice} beats ${computerChoice}`;
  } else {
    computerScore++;
    result = `You Lose! ${computerChoice} beats ${playerChoice}`;
  }

  resultDiv.textContent = result;
  scoreDiv.textContent = `You: ${userScore} | Computer: ${computerScore}`;
  saveHistory(playerChoice, computerChoice, result);
  saveScores();
  startTimer(); // Restart after each round
}

function saveScores() {
  localStorage.setItem("rpsScores", JSON.stringify({ userScore, computerScore }));
}

function loadScores() {
  const saved = JSON.parse(localStorage.getItem("rpsScores"));
  if (saved) {
    userScore = saved.userScore;
    computerScore = saved.computerScore;
    scoreDiv.textContent = `You: ${userScore} | Computer: ${computerScore}`;
  }

  const history = JSON.parse(localStorage.getItem("rpsHistory")) || [];
  history.forEach(item => addToHistoryList(item));
}

function resetScore() {
  userScore = 0;
  computerScore = 0;
  localStorage.clear();
  scoreDiv.textContent = `You: 0 | Computer: 0`;
  historyUl.innerHTML = "";
}

function saveHistory(player, computer, result) {
  const entry = { player, computer, result };
  const history = JSON.parse(localStorage.getItem("rpsHistory")) || [];
  history.unshift(entry);
  localStorage.setItem("rpsHistory", JSON.stringify(history.slice(0, 10)));
  addToHistoryList(entry);
}

function addToHistoryList({ player, computer, result }) {
  const li = document.createElement("li");
  li.textContent = `You: ${player}, CPU: ${computer} → ${result}`;
  historyUl.prepend(li);
}

// Multiplayer timer
function startTimer() {
  let timeLeft = 5;
  timerDiv.textContent = `Timer: ${timeLeft}`;
  countdown = setInterval(() => {
    timeLeft--;
    timerDiv.textContent = `Timer: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      const randomChoice = choices[Math.floor(Math.random() * 3)];
      playRound(randomChoice);
    }
  }, 1000);
}

startTimer();

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js")
      .then(reg => console.log("SW registered", reg))
      .catch(err => console.error("SW failed", err));
  });
}
