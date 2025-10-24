const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/notificationController');

// Send and get notifications
router.post('/', notificationController.createNotification);
router.get('/', notificationController.getAllNotifications);
router.get('/:id', notificationController.getNotificationById);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;

//xxxx