const API_URL = window.env.API_URL;

const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        localStorage.setItem('username', data.data.lastname);
        window.location.replace('multiplayers.html');
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed');
    }
};

const register = async (firstname, lastname, email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname, lastname, email, password })
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        window.location.replace('index.html');
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed');
    }
};


document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    document.getElementById('loading').style.display = 'block';

    const agreeTerms = document.getElementById('termsCheckbox').checked;
    if (!agreeTerms) {
        alert('Please agree to the terms and conditions');
        return;
    }

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    await login(email, password);
});

document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    document.getElementById('loading').style.display = 'block';

    const agreeTerms = document.getElementById('termsCheckbox').checked;
    if (!agreeTerms) {
        alert('Please agree to the terms and conditions');
        return;
    }

    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    await register(firstname, lastname, email, password);
});


const logout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');

    if (accessToken) {
        try {
            const response = await fetch(`${API_URL}/online/reset`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ online: false }),
            });

            if (!response.ok) {
                throw new Error('Failed to update online status');
            }

            window.location.replace('index.html');
        } catch (error) {
            console.error('Logout error:', error);
            window.location.replace('index.html');
        }
    } else {
        window.location.replace('index.html');
    }
};

const searchOnlineUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/user/online`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        const onlineUsersList = document.querySelector("#onlineUsersList");

        responseData.data.forEach(user => {
            const name = user.firstname + ' ' + user.lastname;
            const listItem = document.createElement('li');
            listItem.textContent = name;
            listItem.style.cursor = 'pointer';
            listItem.style.padding = '5px';
            onlineUsersList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error searching online users:', error);
    }
};


// Function to search for available games
async function getAvailableGames() {
    const accessToken = getCookie("accessToken") || localStorage.getItem("accessToken");
    if (accessToken) {
        try {
            // Fetch available games from the API endpoint
            const response = await fetch(window.env.API_URL + "/game/available", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie("accessToken") || localStorage.getItem("accessToken")}`
                }
            });

            // Process the object of available games returned by the server
            const responseData = await response.json();
            const data = responseData;
            console.log(data);

            // Display available games in the UI
            // Code for displaying available games goes here...

        } catch (error) {
            console.error("Error fetching available games:", error);
        }
    }
}
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}