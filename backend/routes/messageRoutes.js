const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { sendMessage, getConversation } = require('../controllers/messageController');

router.post('/send', protect, sendMessage);
router.get('/conversation', protect, getConversation);

module.exports = router;
