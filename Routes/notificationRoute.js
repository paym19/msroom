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
 *     summary: Create a notification
 *     tags: [Notification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event
 *               - recipientId
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
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: Get all notifications
 *     tags: [Notification]
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Internal server error
 *
 * /notifications/{id}:
 *   get:
 *     summary: Get notification by ID
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete notification by ID
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         event: { type: string }
 *         title: { type: string }
 *         message: { type: string }
 *         recipientId:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             name: { type: string }
 *             email: { type: string }
 *         organizationId:
 *           type: object
 *           nullable: true
 *           properties:
 *             _id: { type: string }
 *             name: { type: string }
 *         roomId:
 *           type: object
 *           nullable: true
 *           properties:
 *             _id: { type: string }
 *             name: { type: string }
 */
