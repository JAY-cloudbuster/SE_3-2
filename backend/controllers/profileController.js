const User = require('../models/User');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('name city state bio ratingAverage ratingCount');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { city, state, bio } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (city !== undefined) user.city = city;
        if (state !== undefined) user.state = state;
        if (bio !== undefined) user.bio = bio;

        const updatedUser = await user.save();

        res.json({
            name: updatedUser.name,
            city: updatedUser.city,
            state: updatedUser.state,
            bio: updatedUser.bio,
            ratingAverage: updatedUser.ratingAverage,
            ratingCount: updatedUser.ratingCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getFarmerProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.farmerId).select('name city state bio ratingAverage ratingCount role');
        if (!user || user.role !== 'FARMER') {
            return res.status(404).json({ message: 'Farmer not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getFarmerProfile
};