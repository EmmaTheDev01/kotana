
//SLIDER
var swiper = new Swiper(".slide-content", {
  slidesPerView: 5,
  centeredSlides: true, 
  spaceBetween: 20, 
  loop: true,
  loopAllGroupWithBlank: true,
  grabCursor: true,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    540: {
      slidesPerView: 2,
    },
    950: {
      slidesPerView: 5,
    },
  }
});
const startingSeconds = 20;
let time = localStorage.getItem("savedTime") || startingSeconds;
const timer = document.getElementById("timer");
const shuffleButton = document.getElementById("shuffle");
const upperCard = document.querySelector(".card");
const defaultCard = document.querySelector("#default_card");
const SliderContainer = document.querySelector(".slide-container");
let countdownInterval;

const slider = document.querySelector(".slide-content");
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
  // Update description and hint
  const descriptionElement = document.querySelector(".description-heading");
  const hintElement = document.querySelector(".hint-heading");

  descriptionElement.textContent = `Description: ${cardData.description}`;
  hintElement.textContent = `Hint: ${cardData.hint}`;

  // Display images in the slider with the same hint
  const filteredImages = allCards.filter((card) => card.hint === cardData.hint);
  displaySlider(filteredImages);
}function displaySlider(images) {
  // Clear existing slides using Swiper API
  swiper.removeAllSlides();

  // Add images to the slider
  images.forEach((imageData) => {
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide", "card");

    const cardImage = document.createElement("div");
    cardImage.classList.add("card-image");

    const img = document.createElement("img");
    img.src = imageData.image;
    img.classList.add('card-img');
    img.alt = `card ${imageData.description}`;
    slider.style.overflow="hidden";
    cardImage.appendChild(img);
    slide.appendChild(cardImage);

    // Add the slide to the Swiper instance
    swiper.appendSlide(slide);

    // Log image data to console
    console.log("Image Source:", imageData.image);
    console.log("Description:", imageData.description);
    console.log("Hint:", imageData.hint);
    console.log("----------------------");
  });

  // Update the Swiper instance
  swiper.update();
  shuffleButton.style.display = "none";
}