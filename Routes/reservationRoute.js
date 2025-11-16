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

/**
 * @openapi
 * /reservations:
 *   post:
 *     summary: Create reservation
 *     tags: [Reservation]
 */

/**
 * @openapi
 * /reservations:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservation]
 */

/**
 * @openapi
 * /reservations/{id}:
 *   get:
 *     summary: Get reservation by ID
 *     tags: [Reservation]
 */

/**
 * @openapi
 * /reservations/{id}:
 *   put:
 *     summary: Update reservation
 *     tags: [Reservation]
 */

/**
 * @openapi
 * /reservations/{id}:
 *   delete:
 *     summary: Delete reservation
 *     tags: [Reservation]
 */

/**
 * @openapi
 * /reservations/{id}/status:
 *   patch:
 *     summary: Update reservation status
 *     tags: [Reservation]
 */

