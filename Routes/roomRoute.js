const express = require('express');
const router = express.Router();
const roomController = require('../Controllers/roomController');

// CRUD for Room
router.post('/', roomController.createRoom);
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

// Room-specific operations
router.post('/:id/set-rules', roomController.setRoomRules);
router.post('/:id/set-availability', roomController.setAvailability);

module.exports = router;

/**
 * @openapi
 * /rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organizationId
 *               - name
 *             properties:
 *               organizationId:
 *                 type: string
 *                 description: ID ขององค์กร
 *               name:
 *                 type: string
 *                 description: ชื่อห้อง
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               needApproval:
 *                 type: boolean
 *               googleCalendar:
 *                 type: object
 *                 properties:
 *                   autoCreate:
 *                     type: boolean
 *                   calendarId:
 *                     type: string
 *               questionBox:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       401:
 *         description: Unauthorized please login
 *       403:
 *         description: User is not a member of the organization
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: Get all rooms
 *     tags: [Room]
 *     responses:
 *       200:
 *         description: List of rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       500:
 *         description: Internal server error
 *
 * /rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     tags: [Room]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update room
 *     tags: [Room]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update
 *     responses:
 *       200:
 *         description: Room updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete room
 *     tags: [Room]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 *
 * /rooms/{id}/rules:
 *   patch:
 *     summary: Set or update room rules
 *     tags: [Room]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               minAdvanceHours:
 *                 type: number
 *               maxHoursPerBooking:
 *                 type: number
 *               allowedUserType:
 *                 type: array
 *                 items:
 *                   type: string
 *               customConditions:
 *                 type: object
 *     responses:
 *       200:
 *         description: Room rules updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 *
 * /rooms/{id}/availability:
 *   patch:
 *     summary: Set room availability dates
 *     tags: [Room]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               availableDates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     dayOfWeek:
 *                       type: string
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *     responses:
 *       200:
 *         description: Room availability updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         organizationId:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             name: { type: string }
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: string
 *         capacity:
 *           type: integer
 *         needApproval:
 *           type: boolean
 *         googleCalendar:
 *           type: object
 *           properties:
 *             calendarId: { type: string }
 *             syncEnabled: { type: boolean }
 *         questionBox:
 *           type: array
 *           items:
 *             type: object
 *         rules:
 *           type: object
 *         availableDates:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               dayOfWeek: { type: string }
 *               startTime: { type: string, format: date-time }
 *               endTime: { type: string, format: date-time }
 *         createdBy:
 *           type: string
 */


