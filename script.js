// Select DOM elements
const dial = document.getElementById("dial");
const counter = document.getElementById("counter");
const message = document.getElementById("message");
const submitButton = document.getElementById("submit-button");
const safe = document.getElementById("safe");

// Sounds
const dialSound = new Audio("sounds/dial-turn.mp3");
const submitSound = new Audio("sounds/submit-beep.mp3");
const victorySound = new Audio("sounds/victory.mp3");
const lockSound = new Audio("sounds/lock-clank.mp3");

// Variables
let currentAngle = 0;
let currentNumber = 0;
let codeIndex = 0;
const code = [68, 21, 83];
const userInput = [];

// Play a sound
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

// Update the counter based on the dial's rotation
function updateCounter(angle) {
  currentNumber = Math.floor((angle % 360 + 360) % 360 / 3.6); // Scale 0-360 to 0-100
  counter.textContent = currentNumber;
}

// Add animations and sound when the counter updates
function updateCounterWithAnimation(angle) {
  counter.classList.add("flip");
  playSound(dialSound);
  updateCounter(angle);
  setTimeout(() => counter.classList.remove("flip"), 500);
}

// Show glow effects on the safe
function showSafeEffect(win) {
  safe.classList.remove("win", "lose");
  if (win) {
    safe.classList.add("win");
  } else {
    safe.classList.add("lose");
  }
}

// Rotate the dial and update the counter
dial.addEventListener("mousedown", (e) => {
  const startAngle = currentAngle;
  const startX = e.clientX;
  const startY = e.clientY;

  function rotate(event) {
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    currentAngle = startAngle + Math.atan2(dy, dx) * (180 / Math.PI);
    dial.style.transform = `translate(-50%, -50%) rotate(${currentAngle}deg)`;
    updateCounterWithAnimation(currentAngle);
  }

  function stopRotate() {
    document.removeEventListener("mousemove", rotate);
    document.removeEventListener("mouseup", stopRotate);
  }

  document.addEventListener("mousemove", rotate);
  document.addEventListener("mouseup", stopRotate);
});

// Handle submit button clicks
submitButton.addEventListener("click", () => {
  playSound(submitSound);
  userInput.push(currentNumber);

  if (userInput.length < 3) {
    message.textContent = `Enter the next number (${3 - userInput.length} left).`;
  } else {
    const isCorrect = code.every((num, idx) => num === userInput[idx]);
    message.textContent = isCorrect ? "You Win!" : "Locked";
    playSound(isCorrect ? victorySound : lockSound);
    showSafeEffect(isCorrect);
  }
});
