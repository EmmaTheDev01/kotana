const startingSeconds = 20;
let time = startingSeconds;
const timer = document.getElementById("timer");
const shuffleButton = document.getElementById("shuffle");
const upperCard = document.querySelector(".card");
const defaultCard = document.querySelector("#default_card");
const SliderContainer = document.querySelector(".slider-container");
let countdownInterval;

const slider = document.getElementById("slider");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

let currentIndex = 0;

function startCountDown() {
  countdownInterval = setInterval(changeCountDown, 1000);
}

function stopCountDown() {
  clearInterval(countdownInterval);
}

function changeCountDown() {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  timer.innerHTML = `${minutes < 10 ? "0" + minutes : minutes} : ${seconds}`;

  if (time === 0) {
    setTimerStyle("red", "00", "00");
    stopCountDown();
    location.reload();
  }

  time--;
}

function setTimerStyle(color, minutes = "", seconds = "") {
  timer.style.color = color;
  timer.innerHTML = `${minutes} : ${seconds}`;
}

// Event listener for the shuffle button
shuffleButton.addEventListener("click", () => {
  setTimerStyle("rgb(121, 236, 121)", "00", "00"); // Reset style to default
  time = startingSeconds; // Reset time to starting value
  stopCountDown(); // Stop the countdown if it's already running
  startCountDown(); // Start the countdown
  //Reduce the height of the default card
  defaultCard.style.width = "100px";
  defaultCard.classList.add("shaking-image")
  SliderContainer.classList.remove("hidden");
});

//Silder

function showSlide(index) {
  const newPosition = -index * 25 + "%"; // 25% because there are 4 cards per page
  slider.style.transform = "translateX(" + newPosition + ")";
}

function showNextSlide() {
  currentIndex = (currentIndex + 4) % (slider.children.length - 3);
  showSlide(currentIndex);
}

function showPrevSlide() {
  currentIndex =
    (currentIndex - 4 + slider.children.length) % (slider.children.length - 3);
  showSlide(currentIndex);
}

prevButton.addEventListener("click", showPrevSlide);
nextButton.addEventListener("click", showNextSlide);
