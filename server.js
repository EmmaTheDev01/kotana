// app.js

// Login function
const login = async (email, password) => {
    try {
        const response = await fetch(window.env.API_URL + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        console.log(data);

        // Save the access token to a cookie
        document.cookie = `accessToken=${data.token};expires=${new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString()};path=/`;
        // Save the access token to local storage as well
        localStorage.setItem('accessToken', data.token);
        // Save the firstname to the local storage
        localStorage.setItem('username', data.data.lastname);
        // Redirecting to the guide page
        window.location.href = 'multiplayers.html';
    } catch (error) {
        console.error(error);
        alert('Login failed');
    }
};

// Register function
const register = async (firstname, lastname, email, password, confirm_password) => {
    try {
        const response = await fetch(window.env.API_URL + '/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname,
                lastname,
                email,
                password
            })
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        // Redirecting to the login page
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Registration failed');
    }
};

// Logout function
const logout = () => {
    const accessToken = localStorage.getItem('accessToken');

    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');

    if (accessToken) {
        fetch(window.env.API_URL + '/online/reset', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ online: false }),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to update online status');
                }
            })
            .then(data => {
                window.location.href = 'index.html';
            })
            .catch(error => {
                console.error('Fetch error:', error);
                window.location.href = 'index.html';
            });
    } else {
        window.location.href = 'index.html';
    }
};

// Get online users function
const searchOnlineUsers = async () => {
    const accessToken = document.cookie.split('; ').find(row => row.startsWith('accessToken=')).split('=')[1];
    if (accessToken) {
        try {
            const loadingSpinner = document.querySelector('.l-spinner');
            loadingSpinner.style.display = 'block';

            const response = await fetch(window.env.API_URL + '/user/online', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            const data = responseData.data;
            console.log(data)
            const onlineusersList = document.querySelector("#onlineUsersList");

            data.forEach(user => {
                const name = user.firstname + ' ' + user.lastname;
                const listItem = document.createElement('li');
                listItem.textContent = name;
                listItem.style.cursor = 'pointer';
                listItem.style.padding = '5px';
                onlineusersList.appendChild(listItem);
            });

            loadingSpinner.style.display = 'none';
        } catch (error) {
            console.error('Error searching online users:', error);
        }
    }
};

// Add event listeners for login and register forms
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

document.getElementById('registerForm').addEventListener('submit', function (event) {
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
    const confirm_password = document.getElementById('confirm_password').value;

    register(firstname, lastname, email, password, confirm_password);
});

// Call searchOnlineUsers function when the window loads
window.onload = searchOnlineUsers;
