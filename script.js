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
let startAngle = null;

// Confetti effect
function createConfetti() {
  const confettiCount = 100;
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.animationDuration = `${Math.random() * 2 + 3}s`;
    confetti.style.animationDelay = `${Math.random()}s`;
    document.body.appendChild(confetti);

    // Remove confetti after animation ends
    confetti.addEventListener("animationend", () => confetti.remove());
  }
}

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
    createConfetti(); // Trigger confetti on win
  } else {
    safe.classList.add("lose");
  }
}

// Handle rotation
function handleRotate(eventX, eventY, isTouch = false) {
  const rect = dial.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = eventX - centerX;
  const dy = eventY - centerY;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  if (startAngle === null) {
    startAngle = angle - currentAngle;
  }

  currentAngle = angle - startAngle;
  dial.style.transform = `translate(-50%, -50%) rotate(${currentAngle}deg)`;
  updateCounterWithAnimation(currentAngle);
}

// Mouse events
dial.addEventListener("mousedown", (e) => {
  e.preventDefault(); // Prevents unwanted selection
  const startX = e.clientX;
  const startY = e.clientY;

  function rotate(event) {
    handleRotate(event.clientX, event.clientY);
  }

  function stopRotate() {
    document.removeEventListener("mousemove", rotate);
    document.removeEventListener("mouseup", stopRotate);
    startAngle = null; // Reset start angle
  }

  document.addEventListener("mousemove", rotate);
  document.addEventListener("mouseup", stopRotate);
});

// Touch events for mobile
dial.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Prevent scrolling
  const touch = e.touches[0];
  const startX = touch.clientX;
  const startY = touch.clientY;

  function rotate(event) {
    const touchMove = event.touches[0];
    handleRotate(touchMove.clientX, touchMove.clientY, true);
  }

  function stopRotate() {
    document.removeEventListener("touchmove", rotate);
    document.removeEventListener("touchend", stopRotate);
    startAngle = null; // Reset start angle
  }

  document.addEventListener("touchmove", rotate);
  document.addEventListener("touchend", stopRotate);
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
