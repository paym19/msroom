const express = require('express');
const router = express.Router();
const logController = require('../Controllers/logController');


router.get('/', logController.getLogs);
router.post('/', logController.createLog)


module.exports = router;

/**
 * @openapi
 * /logs:
 *   get:
 *     summary: Get all logs
 *     tags: [Log]
 *     responses:
 *       200:
 *         description: List of logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Log'
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a new log
 *     tags: [Log]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *               - userId
 *             properties:
 *               action: { type: string, description: "Action description" }
 *               userId: { type: string, description: "ID of the user performing the action" }
 *               roomId: { type: string, nullable: true, description: "Optional room ID" }
 *               organizationId: { type: string, nullable: true, description: "Optional organization ID" }
 *               detail: { type: string, description: "Additional details" }
 *     responses:
 *       201:
 *         description: Log created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Log'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 * components:
 *   schemas:
 *     Log:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         action: { type: string }
 *         detail: { type: string }
 *         userId:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             name: { type: string }
 *             email: { type: string }
 *         roomId:
 *           type: object
 *           nullable: true
 *           properties:
 *             _id: { type: string }
 *             name: { type: string }
 *         organizationId:
 *           type: object
 *           nullable: true
 *           properties:
 *             _id: { type: string }
 *             name: { type: string }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 */

