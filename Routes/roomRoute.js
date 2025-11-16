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
 *     summary: Create room
 *     tags: [Room]
 */

/**
 * @openapi
 * /rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Room]
 */

/**
 * @openapi
 * /rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     tags: [Room]
 */

/**
 * @openapi
 * /rooms/{id}:
 *   put:
 *     summary: Update room
 *     tags: [Room]
 */

/**
 * @openapi
 * /rooms/{id}:
 *   delete:
 *     summary: Delete room
 *     tags: [Room]
 */

/**
 * @openapi
 * /rooms/{id}/rules:
 *   post:
 *     summary: Set room rules
 *     tags: [Room]
 */

/**
 * @openapi
 * /rooms/{id}/availability:
 *   post:
 *     summary: Set available times
 *     tags: [Room]
 */
