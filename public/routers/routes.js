const express = require('express');
const path = require('path');
const router = express.Router();
const userController = require('../controllers/userController');
const logController = require('../controllers/logController');
const { getLogs, addLog, deleteLog } = require('../controllers/logController');
const { isLoggedIn } = require('../middlewares/authMiddleware');
const User = require('../models/user');

// Serve index.html as the default route
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Route to handle updating the password
router.post('/profile/update-password', isLoggedIn, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.session.userId;

  try {
    const user = await User.findById(userId);
    if (!user || user.password !== currentPassword) {
      return res.redirect('/profile?passwordUpdateStatus=error');
    }
    user.password = newPassword;
    await user.save();
    await addLog(userId.toString(), "Update Password Successful");
    res.redirect('/profile?passwordUpdateStatus=success');
  } catch (error) {
    console.error('Error updating password:', error);
    res.redirect('/profile?passwordUpdateStatus=error');
    await addLog(userId.toString(), "Update Password Failed");
  }
});

// Serve profile.html as the profile route
router.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/profile.html'));
});

router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/signup.html'));
});

// Your route handlers
router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.get('/logout', userController.logoutUser);
router.put('/profile/:id', isLoggedIn, userController.updateProfile);
router.delete('/delete-user', userController.deleteUser);
router.get('/logs', logController.getLogs);
router.post('/logs', logController.addLog);
router.delete('/logs/:id', logController.deleteLog);

module.exports = router;