const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/notificationController');

// Send and get notifications
router.post('/', notificationController.createNotification);
router.get('/', notificationController.getAllNotifications);
router.get('/:id', notificationController.getNotificationById);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;

/**
 * @openapi
 * /notifications:
 *   post:
 *     summary: Create notification
 *     tags: [Notification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event: { type: string }
 *               title: { type: string }
 *               message: { type: string }
 *               recipientId: { type: string }
 *               organizationId: { type: string }
 *               roomId: { type: string }
 *               email: { type: string }
 *     responses:
 *       201:
 *         description: Notification created
 */

/**
 * @openapi
 * /notifications:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notification]
 *     responses:
 *       200:
 *         description: List of notifications
 */

/**
 * @openapi
 * /notifications/{id}:
 *   get:
 *     summary: Get notification by ID
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Notification info
 */

/**
 * @openapi
 * /notifications/{id}:
 *   delete:
 *     summary: Delete notification
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Notification deleted
 */
