const startingSeconds = 20;
let time = localStorage.getItem("savedTime") || startingSeconds;
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
    // Reset the timer to 20 seconds using localStorage saved time
    time = Math.max(localStorage.getItem("savedTime") || 0, startingSeconds);
  }

  time--;
  // Save the remaining time to localStorage
  localStorage.setItem("savedTime", time);
}

function setTimerStyle(color, minutes = "", seconds = "") {
  timer.style.color = color;
  timer.innerHTML = `${minutes} : ${seconds}`;
}

// Event listener for the shuffle button
shuffleButton.addEventListener("click", () => {
  setTimerStyle("rgb(121, 236, 121)", "00", "00"); // Reset style to default
  time = localStorage.getItem("savedTime") || startingSeconds; // Retrieve saved time or use the starting value
  stopCountDown(); // Stop the countdown if it's already running
  startCountDown(); // Start the countdown
  // Reduce the height of the default card
  defaultCard.style.width = "100px";
  defaultCard.classList.add("shaking-image");
  SliderContainer.classList.remove("hidden");

  // Fetch data from JSON file
  fetchDataAndDisplay();
});

// Slider

function showSlide(index) {
  const newPosition = -index * 35 + "%"; // 25% because there are 4 cards per page
  slider.style.transform = "translateX(" + newPosition + ")";
}

function showNextSlide() {
  currentIndex = (currentIndex + 2) % (slider.children.length - 3);
  showSlide(currentIndex);
}

function showPrevSlide() {
  currentIndex =
    (currentIndex - 4 + slider.children.length) % (slider.children.length - 3);
  showSlide(currentIndex);
}

prevButton.addEventListener("click", showPrevSlide);
nextButton.addEventListener("click", showNextSlide);

// New code for slider and shuffle

// Function to fetch data from JSON file and display
async function fetchDataAndDisplay() {
  try {
    const response = await fetch("data.json");
    console.log("Response status:", response.status);

    const data = await response.json();
    console.log("Data received:", data);

    // Shuffle the cards
    shuffleArray(data.cards);

    // Display the first card in the UI
    displayCard(data.cards[0], data.cards);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to shuffle array items randomly
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to display a card
function displayCard(cardData, allCards) {
  // Update image source
  defaultCard.src = cardData.image;

  // Update description and hint
  const descriptionElement = document.querySelector(".description-heading");
  const hintElement = document.querySelector(".hint-heading");

  descriptionElement.textContent = `Description: ${cardData.description}`;
  hintElement.textContent = `Hint: ${cardData.hint}`;

  // Display images in the slider with the same hint
  const filteredImages = allCards.filter((card) => card.hint === cardData.hint);
  displaySlider(filteredImages);
}

// Function to display images in the slider
function displaySlider(images) {
  // Clear existing slider content
  slider.innerHTML = "";

  // Add images to the slider
  images.forEach((imageData) => {
    const slide = document.createElement("div");
    slide.classList.add("slide");
    const img = document.createElement("img");
    img.src = imageData.image;
    img.alt = `card ${imageData.description}`;
    slide.appendChild(img);
    slider.appendChild(slide);

    // Log image data to console
    console.log("Image Source:", imageData.image);
    console.log("Description:", imageData.description);
    console.log("Hint:", imageData.hint);
    console.log("----------------------");
  });

  // Reset slider position
  currentIndex = 0;
  showSlide(currentIndex);
}
