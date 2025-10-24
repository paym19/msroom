const express = require('express');
const router = express.Router();
const reservationController = require('../Controllers/reservationController');

// CRUD for Reservation
router.post('/', reservationController.createReservation);
router.get('/', reservationController.getAllReservations);
router.get('/:id', reservationController.getReservationById);
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);

// Change status (approve, reject, cancel)
router.post('/:id/status', reservationController.updateReservationStatus);

module.exports = router;
