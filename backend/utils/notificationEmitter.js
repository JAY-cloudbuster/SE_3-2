const Notification = require('../models/Notification');

async function createAndEmitNotification({
    io,
    userId,
    role,
    title,
    message,
    type,
    eventName,
}) {
    if (!io || !userId || !role || !title || !message || !type) {
        console.warn('[NotificationEmitter] Skipped — missing param:', {
            hasIo: !!io,
            userId: String(userId),
            role,
            type,
        });
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

    const payload = {
        _id: notification._id,
        userId: notification.userId,
        role: notification.role,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
    };

    const room = `user:${String(userId)}`;
    const roomSockets = await io.in(room).allSockets();
    console.log(`[NotificationEmitter] Emitting "${title}" to room "${room}" (${roomSockets.size} socket(s) connected)`);

    io.to(room).emit('notification_created', payload);

    if (eventName) {
        io.to(room).emit(eventName, payload);
    }

    return notification;
}

module.exports = {
    createAndEmitNotification,
};
