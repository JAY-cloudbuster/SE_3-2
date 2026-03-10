const User = require('../models/User');

const rateFarmer = async (req, res) => {
    try {
        if (req.user.role !== 'BUYER') {
            return res.status(403).json({ message: 'Only buyers can rate farmers' });
        }

        const { rating } = req.body;
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const farmer = await User.findById(req.params.farmerId);

        if (!farmer || farmer.role !== 'FARMER') {
            return res.status(404).json({ message: 'Farmer not found' });
        }

        farmer.ratings.push(rating);
        farmer.ratingCount = farmer.ratings.length;
        
        const sum = farmer.ratings.reduce((acc, curr) => acc + curr, 0);
        farmer.ratingAverage = parseFloat((sum / farmer.ratingCount).toFixed(2));

        await farmer.save();

        res.json({ 
            message: 'Rating submitted successfully', 
            ratingAverage: farmer.ratingAverage, 
            ratingCount: farmer.ratingCount 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    rateFarmer
};