// Function to handle registration
function register() {
    // Retrieve username and password from the form
    var username = document.getElementById("regUsername").value;
    var password = document.getElementById("regPassword").value;

    // Perform any necessary validation

    // Example AJAX request to handle registration
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
            // Registration successful, display success message
            alert("Registration successful!");
        } else {
            // Registration failed, display error message
            alert("Registration failed. Please try again.");
        }
    })
    .catch(error => {
        // Handle any network errors
        console.error('Error:', error);
        // Display error message to the user
        alert("An error occurred while registering. Please try again later.");
    });
}


// Login function
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
            // Optionally, redirect the user to their profile page
            window.location.href = '/profile';
        } else {
            alert('Login failed. Please check your credentials.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Update profile function
function updateProfile() {
  const username = document.getElementById('profileUsername').value; // Assuming you have an input field with id 'profileUsername' for updating username
  const password = document.getElementById('profilePassword').value; // Assuming you have an input field with id 'profilePassword' for updating password
  fetch('/profile/:id', { // Assuming you're sending the user ID as a parameter in the URL
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
  })
  .then(response => {
      if (response.ok) {
          alert('Profile updated successfully!');
          // Optionally, redirect the user to their profile page or refresh the page to reflect the changes
          window.location.reload(); // Reload the page to reflect the changes
      } else {
          alert('Failed to update profile. Please try again.');
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
}
// Define the createLog function
const createLog = async (userId, action, message) => {
    try {
        // Send a request to add log entry to the server
        const response = await fetch('/logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, action, message })
        });

        if (response.ok) {
            console.log('Log added successfully');
        } else {
            console.error('Failed to add log:', response.statusText);
        }
    } catch (error) {
        console.error('Error adding log:', error);
    }
};

// Example usage: create a log entry for successful login
const userId = 'dbUser'; // Replace with actual user ID
createLog(userId, 'Login', 'User logged in successfully');