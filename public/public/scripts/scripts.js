// Function to handle registration
function register() {
    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
        }),
    })
        .then(response => {
            if (response.ok) {
                alert("Registration successful!");
            } else {
                alert("Registration failed. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred while registering. Please try again later.");
        });
}

// Function to handle login
function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            if (response.ok) {
                alert('Login successful!');
                window.location.href = '/profile';
            } else {
                alert('Login failed. Please check your credentials.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to show the Forgot Password form
function showForgotPasswordForm() {
    document.getElementById('forgotPasswordForm').style.display = 'block';
}

// Function to handle password reset
function resetPassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (newPassword !== confirmNewPassword) {
        document.getElementById('updatePasswordMessage').innerHTML = '<p class="error-message">New password and confirm password do not match.</p>';
        return;
    }

    fetch('/profile/update-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
    })
        .then(response => {
            if (response.ok) {
                document.getElementById('updatePasswordMessage').innerHTML = '<p class="success-message">Password updated successfully!</p>';
            } else {
                document.getElementById('updatePasswordMessage').innerHTML = '<p class="error-message">Failed to update password. Please try again.</p>';
            }
        })
        .catch(error => {
            console.error('Error updating password:', error);
            document.getElementById('updatePasswordMessage').innerHTML = '<p class="error-message">An error occurred. Please try again later.</p>';
        });
}

// Function to fetch logs from the server and display them
function fetchAndDisplayLogs() {
    fetch('/logs')
        .then(response => response.json())
        .then(logs => {
            const logsList = document.getElementById('logsList');
            logsList.innerHTML = ''; // Clear existing logs
            logs.forEach(log => {
                const listItem = document.createElement('li');
                listItem.textContent = log.userId + " " + log.action;
                logsList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching logs:', error));
}

// Fetch and display logs when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayLogs);
