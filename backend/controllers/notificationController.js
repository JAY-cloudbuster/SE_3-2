const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

const getMyNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .limit(100);

    const unreadCount = notifications.filter((item) => !item.isRead).length;

    res.status(200).json({ notifications, unreadCount });
});

const markNotificationRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
        _id: req.params.id,
        userId: req.user.id,
    });

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json(notification);
});

const markAllNotificationsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { userId: req.user.id, isRead: false },
        { $set: { isRead: true } }
    );

    res.status(200).json({ message: 'All notifications marked as read' });
});

module.exports = {
    getMyNotifications,
    markNotificationRead,
    markAllNotificationsRead,
};
