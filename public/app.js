const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const path = require('path');
const session = require('express-session');
const User = require('./models/user');
const userController = require('./controllers/userController');
const logController = require('./controllers/logController');
const { isLoggedIn } = require('./middlewares/authMiddleware');
const Log = require('./models/log');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb+srv://SIT774_Example:it8_P-rscyza99h@cluster0.nata69c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Function to create a log entry
const createLog = async (userId, action, message) => {
  try {
    const log = new Log({
      userId: userId, // Corrected field name
      action: action, // Corrected field name
      message: message
    });
    await log.save();
    console.log('Log added successfully:', log);
  } catch (error) {
    console.error('Error adding log:', error);
  }
};

// // Routes

// // Serve index.html as the default route

let projectsRoute = require('./routers/routes')

app.use('/', projectsRoute);

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '/index.html'));
// });

// // Route to handle updating the password
// app.post('/profile/update-password', isLoggedIn, async (req, res) => {
//   const { currentPassword, newPassword } = req.body;
//   const userId = req.session.userId;

//   try {
//     const user = await User.findById(userId);
//     if (!user || user.password !== currentPassword) {
//       return res.redirect('/profile?passwordUpdateStatus=error');
//     }
//     user.password = newPassword;
//     await user.save();
//     await createLog(userId.toString(), "Update Password", "Password update successful.")
//     res.redirect('/profile?passwordUpdateStatus=success');
//   } catch (error) {
//     console.error('Error updating password:', error);
//     res.redirect('/profile?passwordUpdateStatus=error');
//   }
// });

// // Serve profile.html as the profile route
// app.get('/profile', (req, res) => {
//   res.sendFile(path.join(__dirname, '/profile.html'));
// });



// // Your route handlers
// app.get('/profile', (req, res) => {
//   res.sendFile(path.join(__dirname, '/profile.html'));
// });
// app.post('/login', userController.loginUser);
// app.post('/register', userController.registerUser);
// app.get('/logout', userController.logoutUser);
// app.put('/profile/:id', isLoggedIn, userController.updateProfile);
// app.get('/logs', logController.getLogs);
// app.post('/logs', logController.addLog);
// app.delete('/logs/:id', logController.deleteLog);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});

// Example usage: create a log entry
const userId = 'newuser';
createLog(userId, 'Login', 'User logged in successfully');




