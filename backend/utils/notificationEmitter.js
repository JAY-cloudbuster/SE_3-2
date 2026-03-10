const Notification = require('../models/Notification');

async function createNotification({
    userId,
    role,
    title,
    message,
    type,
}) {
    if (!userId || !role || !title || !message || !type) {
        return null;
    }

    const notification = await Notification.create({
        userId,
        role,
        title,
        message,
        type,
        isRead: false,
    });

    return notification;
}

module.exports = {
    createNotification,
};
