const User = require('../models/user');
const { getLogs, addLog, deleteLog } = require('./logController');


exports.registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        // Create a new user
        const newUser = await User.create({ username, password });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
        addLog(username, "successfully registered user.")
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find user by username and password
        const user = await User.findOne({ username, password });
        if (user) {
            // Set session userId to user's id
            req.session.userId = user._id;
            res.status(200).json({ message: 'Login successful' });
            addLog(username, "Successfully Logged In User.")
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateProfile = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { username, password } = req.body;
    try {
        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(userId, { username, password }, { new: true });
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
        addLog(userId, "Successfully Updated User.")
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteUser = async (req, res) => {
    const { username } = req.body;
    try {
        // Check if the user exists
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Delete the user
        await User.deleteOne({ username });
        
        res.status(200).json({ message: 'User deleted successfully' });
        addLog(username, "successfully deleted user.");
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.logoutUser = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.redirect('/');
        }
    });
};
