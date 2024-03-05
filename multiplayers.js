// Define player1Turn variable
let player1Turn = true;

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
      slidesPerView: 1,
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
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const overlay = document.querySelector(".overlay");
const playeTwo_score = document.querySelector('#player2_score');
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
let player1Score = sessionStorage.getItem("player1Score") || 0;
let player2Score = sessionStorage.getItem("player2Score") || 0;
const scoreText = document.querySelector('#score');
scoreText.textContent = `Score: ${player1Score}`;
playeTwo_score.textContent = `${player2Score}`;
//Ingame alerts
const announcers = document.querySelector('.announcers');
const timeout_text = document.querySelector('.timeout_text');
const level_txt = document.querySelector('.level_txt');
const level_number = document.querySelector('#level_number');
//Modal hiding and displaying
close.addEventListener('click', () => {
  if (modal.classList.contains('hidden')) {
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  }
})
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
defaultCard.addEventListener("click", () => {
  menu.classList.add('hidden');
})
//Timer
let currentIndex = 0;
function startCountDown() {
  countdownInterval = setInterval(changeCountDown, 1000);
}//Fetching all online users 
// Function to search for online users
async function searchOnlineUsers() {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    try {
      // Fetch online users from the API endpoint
      const response = await fetch(window.env.API_URL + "/user/online", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Process the object of online users returned by the server
      const responseData = await response.json();
      const data = responseData.data;
      const onlineusersList = document.querySelector("#onlineUsersList");

      // Iterate over the array of users and display user information
      data.forEach(user => {
        const name = user.firstname + " " + user.lastname;
        const listItem = document.createElement("li");
        listItem.textContent = name;
        onlineusersList.appendChild(listItem);
      });

      // You can handle the list of online users here, such as displaying them in the UI
    } catch (error) {
      console.error("Error searching online users:", error);
      // Handle errors, such as displaying an error message to the user
    }
  }

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
// Event listener for the shuffle button
shuffleButton.addEventListener("click", () => {
  menu.classList.add('hidden');
  announcers.classList.add('hidden');
  SliderContainer.style.display = "block";
  setTimerStyle("rgb(121, 236, 121)", "00", "00"); // Reset style to default
  time = localStorage.getItem("savedTime") || startingSeconds; // Retrieve saved time or use the starting value
  stopCountDown(); // Stop the countdown if it's already running
  success.classList.add('hidden');
  fail.classList.add('hidden')
  // Reduce the height of the default card
  defaultCard.style.width = "100px";
  defaultCard.setAttribute('src', "/cards/1.png")
  defaultCard.classList.add("shaking-image");
  SliderContainer.classList.remove("hidden");

  // Fetch data from JSON file
  fetchDataAndDisplay();
});
// Function to fetch data from JSON file and display
async function fetchDataAndDisplay() {
  try {
    const loadingSpinner = document.querySelector('.loading-spinner');
    loadingSpinner.style.display = 'block';

    const response = await fetch("data.json");
    console.log("Response status:", response.status);

    const data = await response.json();
    // console.log("Data received:", data);

    // Shuffle the cards
    shuffleArray(data.cards);

    // Display the first card in the UI
    displayCard(data.cards[0], data.cards);
    // Hide the loading spinner after fetching data
    loadingSpinner.style.display = 'none';
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
    console.log("score: ", player1Score)
    // Function to check and update the level
    function checkLevel() {
      if (player1Score <= 10) {
        // Set the level
        level = 1;
        // Update any UI elements or perform actions related to level change
        console.log("Level up! Current level: ", level);
        startingSeconds = level_one;
        game_level.textContent = level
        levelUpSound.play();
      } else if (player1Score >= 20 && player1Score < 30) {
        // Increase the level to 3
        level = 2;
        // Update any UI elements or perform actions related to level change
        console.log("Level up! Current level: ", level);
        game_level.textContent = level;
        // Update the startingSeconds based on the new level
        startingSeconds = level_two;
        levelUpSound.play();
      }
      else if (player1Score >= 30 && player1Score < 40) {
        // Increase the level to 3
        level = 3;

        // Update any UI elements or perform actions related to level change
        console.log("Level up! Current level: ", level);
        game_level.textContent = level;
        // Update the startingSeconds based on the new level
        startingSeconds = level_three;
        levelUpSound.play();
      }
      else if (player1Score >= 40 && player1Score < 45) {
        // Increase the level to 3
        level = 4;
        // Update any UI elements or perform actions related to level change
        console.log("Level up! Current level: ", level);
        game_level.textContent = level;
        // Update the startingSeconds based on the new level
        startingSeconds = level_four;
        levelUpSound.play();
      }
      else if (player1Score >= 45) {
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
          if (player1Turn) {
            player1Score++;
          } else {
            player2Score++;
          }

          // Check for winner
          if (player1Score >= 5) {
            alert("Player 1 wins!");
          } else if (player2Score >= 5) {
            alert("Player 2 wins!");
          } else {
            // Update score display
            scoreText.textContent = `Score: ${player1Score}`;
            playeTwo_score.textContent = `${player2Score}`;
            // Continue game
            success.classList.remove('hidden');
            scoreSound.play(); // Play the score sound effect
            // Reset the timer to starting seconds
            time = startingSeconds;
            localStorage.setItem("savedTime", time);
            setTimerStyle("rgb(121, 236, 121)", "00", "00"); // Reset style to default
            stopCountDown();
          }
        } else {
          fail.classList.remove('hidden');
          failSound.play();

          // Switch player if first player fails
          player1Turn = !player1Turn;
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

function incrementScore() {
  // Increment the score of the current player
  if (player1Score >= 5 || player2Score >= 5) {
    return; // Stop incrementing if a player has already won
  }

  if (player1Turn) {
    player1Score++;
  } else {
    player2Score++;
  }
}

function switchPlayer() {
  // Switch player if first player fails
  player1Turn = !player1Turn;
}
