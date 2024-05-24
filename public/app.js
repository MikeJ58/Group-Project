const express = require('express');
const path = require('path');
const session = require('express-session');
const connectDB = require('./config/db');
const { isLoggedIn } = require('./middlewares/authMiddleware');
const projectsRoute = require('./routers/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/', projectsRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});