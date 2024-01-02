
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
let startingSeconds = 60;

const level_two = 45;
const level_three = 35;
const level_four = 30;
const level_five = 20;
let time = localStorage.getItem("savedTime") || startingSeconds;
const game_level = document.querySelector('#game_level')
const timer = document.getElementById("timer");
const shuffleButton = document.getElementById("shuffle");
const upperCard = document.querySelector(".card");
const defaultCard = document.querySelector("#default_card");
const SliderContainer = document.querySelector(".slide-container");

let countdownInterval;

const slider = document.querySelector(".slide-content");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const success = document.querySelector('.success');
const fail = document.querySelector('.fail')
//Score declaration
let score = localStorage.getItem("score") || 0;
const scoreText = document.querySelector('#score');
scoreText.textContent = score;

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
    //Hide the slider container
    SliderContainer.style.display = "none";
  }

  time--;
  // Save the remaining time to localStorage
  localStorage.setItem("savedTime", time);
}

function setTimerStyle(color, minutes = "", seconds = "") {
  timer.style.color = color;
  timer.innerHTML = `${minutes} : ${seconds}`;
}
//Setting the default card to the clicked image

function setDefaultCard(clickedImageIndex) {
  defaultCard.classList.remove("shaking-image");

  // Get the clicked image element using Swiper API
  const clickedImage = swiper.slides[clickedImageIndex].querySelector(".card-img");

  // Get the source file of the clicked image
  const clickedImageSrc = clickedImage.getAttribute("src");

  // Replace the default card with the clicked image
  defaultCard.innerHTML = `<img src="${clickedImageSrc}" class="card-img" alt="card">`;

  SliderContainer.classList.add("hidden");
  stopCountDown();
  shuffleButton.style.display = "block";
}

// Event listener for the shuffle button
shuffleButton.addEventListener("click", () => {
  setTimerStyle("rgb(121, 236, 121)", "00", "00"); // Reset style to default
  time = localStorage.getItem("savedTime") || startingSeconds; // Retrieve saved time or use the starting value
  stopCountDown(); // Stop the countdown if it's already running
  success.classList.add('hidden');
  fail.classList.add('hidden')
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
  startCountDown(); // Start the countdown
}

function displaySlider(images) {
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
    img.style.cursor = "pointer";
    slider.style.overflow = "hidden";
    cardImage.appendChild(img);
    slide.appendChild(cardImage);

    // Add the slide to the Swiper instance
    swiper.appendSlide(slide);

    // Log image data to console
    console.log("Description:", imageData.description);
    console.log("Hint:", imageData.hint);
    console.log("----------------------");

    //Clicking the image to play the game.
    // Add a new level variable
    let level = 0
    console.log(score)
    // Function to check and update the level
    function checkLevel() {
      if (score <= 10) {
        // Increase the level to 2
        level = 1;
        // Update any UI elements or perform actions related to level change
        console.log("Level up! Current level: ", level);
        game_level.textContent = level

        // Optionally, you can reset the score or perform other actions when leveling up
        // score = 0;
        // localStorage.setItem("score", score);

        // Update the startingSeconds based on the new level
        startingSeconds = level_two;
      } else if (score >= 20) {
        // Increase the level to 3
        level = 2;
        // Update any UI elements or perform actions related to level change
        console.log("Level up! Current level: ", level);
        game_level.textContent = level;
        // Update the startingSeconds based on the new level
        startingSeconds = level_three;
      }
      else if (score >= 30) {
        // Increase the level to 3
        level = 3;

        // Update any UI elements or perform actions related to level change
        console.log("Level up! Current level: ", level);

        // Update the startingSeconds based on the new level
        startingSeconds = level_four;
      }
      else if (score >= 40) {
        // Increase the level to 3
        level = 4;
        // Update any UI elements or perform actions related to level change
        console.log("Level up! Current level: ", level);
        game_level.textContent = level;
        // Update the startingSeconds based on the new level
        startingSeconds = level_five;
      }
      else if (score >= 45) {
        // Increase the level to 3
        level = 4;
        // Update any UI elements or perform actions related to level change
        console.log("Level up! Current level: ", level);
        game_level.textContent = level;
      }


      // Update the timer with the new startingSeconds value
      time = localStorage.getItem("savedTime") || startingSeconds;
      setTimerStyle("rgb(121, 236, 121)", "00", "00");
    }
    checkLevel();

    // Modify the score increment code in the img click event listener
    img.addEventListener("click", (event) => {
      // Check if the clicked element is an image
      if (event.target.tagName === "IMG") {
        // Get the clicked image's alt attribute
        const clickedAlt = event.target.alt;

        // Get the current card's description
        const currentCard = document.querySelector(".description-heading").textContent.split(":")[1].trim();

        // Check if the clicked image's alt is equal to the current card's description
        if (clickedAlt === `card ${currentCard}`) {
          // Increment the score
          score++;
          scoreText.textContent = score;
          success.classList.remove('hidden');
          // Save the updated score to localStorage
          localStorage.setItem("score", score);

          // Reset the timer to starting seconds
          time = startingSeconds;
          localStorage.setItem("savedTime", time);
          setTimerStyle("rgb(121, 236, 121)", "00", "00"); // Reset style to default
          stopCountDown();
        } else {
          fail.classList.remove('hidden');
        }
      }
      // Continue with the rest of your code...
      SliderContainer.classList.add("hidden");
      setDefaultCard(swiper.activeIndex);
      shuffleButton.style.display = "block";
      time = startingSeconds;
      localStorage.setItem("savedTime", time);
      setTimerStyle("rgb(121, 236, 121)", "00", "00"); // Reset style to default
      stopCountDown();
    });

  });

  // Update the Swiper instance
  swiper.update();
  const randomNumber = Math.floor(Math.random() * 7);
  swiper.slideTo(randomNumber);

}

