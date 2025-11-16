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
 */

/**
 * @openapi
 * /logs:
 *   post:
 *     summary: Create log entry
 *     tags: [Log]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action: { type: string }
 *               userId: { type: string }
 *               roomId: { type: string }
 *               organizationId: { type: string }
 *               detail: { type: string }
 *     responses:
 *       201:
 *         description: Log created
 */
