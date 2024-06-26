
//SLIDER
var swiper = new Swiper(".slide-content", {
  slidesPerView: 5,
  spaceBetween: 30,
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
      slidesPerView: 2,
      centeredSlides: true,
    },
    440: {
      slidesPerView: 2,
      centeredSlides: true,
    },
    950: {
      slidesPerView: 5,
    },
  },
  initialSlide: 2, // Set the index of the card you want to be initially visible
});
let startingSeconds = 60;
const level_one = 60;
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
const menu = document.querySelector(".menu");
const menu_item = document.querySelector(".menu-item");


//Audio sounds
const scoreSound = document.getElementById('scoreSound');
const failSound = document.getElementById('failSound');
const timeoutSound = document.getElementById('timeoutSound');
const levelUpSound = document.getElementById('levelUpSound');
//Countdown interval
let countdownInterval;
//swiper 
const slider = document.querySelector(".slide-content");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const success = document.querySelector('.success');
const fail = document.querySelector('.fail')
//Score declaration
let score = localStorage.getItem("score") || 0;
const scoreText = document.querySelector('#score');
scoreText.textContent = score;
//Ingame alerts
const announcers = document.querySelector('.announcers');
const timeout_text = document.querySelector('.timeout_text');
const level_txt = document.querySelector('.level_txt');
const level_number = document.querySelector('#level_number');

//Menu display
user.addEventListener('click', () => {
  if (menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
  } else {
    menu.classList.add('hidden');
  }
})
//menu hiding
menu_item.addEventListener('click', () => {
  if (menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
  } else {
    menu.classList.remove('hidden');
  }
})
//Timer
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
    shuffleButton.classList.add('hidden');
    // Reset the timer to 20 seconds using localStorage saved time
    time = Math.max(localStorage.getItem("savedTime") || 0, startingSeconds);
    //Hide the slider container
    announcers.classList.remove('hidden');
    timeout_text.classList.remove('hidden');
    timeoutSound.play();
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
//Setting the default card to the correct image.

function setDefaultCard(cardData) {
  console.log("Setting default card with clicked image data:", cardData);

  defaultCard.classList.remove("shaking-image");

  if (cardData) {
    // Set the default card's src and alt attributes based on the clicked image data
    defaultCard.setAttribute("src", cardData.image);
    defaultCard.alt = `card ${cardData.description}`;

    console.log("Default card updated with clicked image data:", cardData);
  } else {
    console.error("Error: Clicked image data not found.");
  }

  SliderContainer.classList.add("hidden");
  stopCountDown();
  shuffleButton.style.display = "block";
}
// Function to fetch data from JSON file and display
async function fetchDataAndDisplay(jsonFileName) {
  try {
    const loadingSpinner = document.querySelector(".loading-spinner");
    loadingSpinner.style.display = "block";
    loadingSpinner.style.zIndex = "2";

    const response = await fetch(jsonFileName);
    console.log("Response status:", response.status);

    const data = await response.json();
    // console.log("Data received:", data);

    // Shuffle the cards
    shuffleArray(data.cards);

    // Display the first card in the UI
    displayCard(data.cards[0], data.cards);
    // Hide the loading spinner after fetching data
    loadingSpinner.style.display = "none";
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

let currentLanguage = "default"; // Variable to keep track of the current language

// Function to fetch data from JSON file based on language selection
async function fetchData(language) {
  try {
    const loadingSpinner = document.querySelector(".loading-spinner");
    loadingSpinner.style.display = "block";

    let jsonFile;
    if (language === "kinyarwanda") {
      jsonFile = "kinya.json"; // Assuming the Kinyarwanda JSON file is named kinya.json
    } else {
      jsonFile = "data.json"; // Assuming the default JSON file is named data.json
    }

    await fetchDataAndDisplay(jsonFile);
    currentLanguage = language; // Update the current language
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


// Then call fetchDataAndDisplay() with the appropriate JSON file name when needed, for example:
// Inside changeLanguage() function:
function changeLanguage() {
  fetchData("kinyarwanda");
}

// Update the fetchDataAndDisplay function call inside the shuffleButton click event listener:
shuffleButton.addEventListener("click", () => {
  menu.classList.add("hidden");
  announcers.classList.add("hidden");
  SliderContainer.style.display = "block";
  setTimerStyle("rgb(121, 236, 121)", "00", "00"); // Reset style to default
  time = localStorage.getItem("savedTime") || startingSeconds; // Retrieve saved time or use the starting value
  stopCountDown(); // Stop the countdown if it's already running
  success.classList.add("hidden");
  fail.classList.add("hidden");
  // Reduce the height of the default card
  defaultCard.style.width = "100px";
  defaultCard.setAttribute("src", "/cards/1.png");
  defaultCard.classList.add("shaking-image");
  SliderContainer.classList.remove("hidden");

  // Fetch data from JSON file based on language selection
  fetchData(currentLanguage);
});

// Function to handle click event on the kinyarwanda div
const kinyarwandaDiv = document.querySelector(".kinyarwanda");
kinyarwandaDiv.addEventListener("click", () => {
  fetchData("kinyarwanda");
});

// Function to shuffle array items randomly
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to display a card
let currentCardData; // Declare a variable to hold the current card data

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
  // Set the current card data
  currentCardData = cardData;
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
    img.classList.add('card-img', 'lazyload');
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
    let level = 1
    console.log("score: ", score)
    // Function to check and update the level
    function checkLevel() {
      if (score <= 10) {
        // Set the level
        level = 1;
        // Update any UI elements or perform actions related to level change
        console.log("Level up! Current level: ", level);
        startingSeconds = level_one;
        game_level.textContent = level
        levelUpSound.play();
      } else if (score >= 20 && score < 30) {
        // Increase the level to 3
        level = 2;
        // Update any UI elements or perform actions related to level change
        console.log("Level up! Current level: ", level);
        game_level.textContent = level;
        // Update the startingSeconds based on the new level
        startingSeconds = level_two;
        levelUpSound.play();
      }
      else if (score >= 30 && score < 40) {
        // Increase the level to 3
        level = 3;

        // Update any UI elements or perform actions related to level change
        console.log("Level up! Current level: ", level);
        game_level.textContent = level;
        // Update the startingSeconds based on the new level
        startingSeconds = level_three;
        levelUpSound.play();
      }
      else if (score >= 40 && score < 45) {
        // Increase the level to 3
        level = 4;
        // Update any UI elements or perform actions related to level change
        console.log("Level up! Current level: ", level);
        game_level.textContent = level;
        // Update the startingSeconds based on the new level
        startingSeconds = level_four;
        levelUpSound.play();
      }
      else if (score >= 45) {
        // Increase the level to 3
        level = 5;
        // Update any UI elements or perform actions related to level change
        console.log("Level up! Current level: ", level);
        game_level.textContent = level;
        // Update the startingSeconds based on the new level
        startingSeconds = level_five;
        levelUpSound.play();
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
        const currentCard = currentCardData.description.trim();

        // Check if the clicked image's alt is equal to the current card's description
        if (clickedAlt.trim() === `card ${currentCard.trim()}`) {
          // Increment the score
          score++;
          scoreText.textContent = `score: ${score}`;
          success.classList.remove('hidden');
          // Save the updated score to localStorage
          localStorage.setItem("score", score);
          scoreSound.play(); // Play the score sound effect
          // Reset the timer to starting seconds
          time = startingSeconds;
          localStorage.setItem("savedTime", time);
          img.removeEventListener("click", this);
          SliderContainer.classList.add("hidden");
          setTimerStyle("rgb(121, 236, 121)", "00", "00"); // Reset style to default
          stopCountDown();
        } else {
          fail.classList.remove('hidden');
          failSound.play();
          img.removeEventListener("click", this);
          SliderContainer.classList.add("hidden");
        }
      }

      SliderContainer.classList.add("hidden");
      setDefaultCard(currentCardData);
      shuffleButton.style.display = "block";
      time = startingSeconds;
      localStorage.setItem("savedTime", time);
      setTimerStyle("rgb(121, 236, 121)", "00", "00"); // Reset style to default
      stopCountDown();
      img.removeEventListener("click", this);
    });

  });

  // Update the Swiper instance
  swiper.update();
  const randomNumber = Math.floor(Math.random() * 7);
  swiper.slideTo(randomNumber);

}

