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
