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
 *     summary: Create a new reservation
 *     tags: [Reservation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *               - organizationId
 *               - userId
 *               - startTime
 *               - endTime
 *             properties:
 *               roomId:
 *                 type: string
 *                 description: ID ของห้องที่ต้องการจอง
 *               organizationId:
 *                 type: string
 *                 description: ID ขององค์กร
 *               userId:
 *                 type: string
 *                 description: ID ของผู้จอง
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: เวลาเริ่มต้นการจอง
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: เวลาสิ้นสุดการจอง
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                 description: คำตอบจากคำถามของห้อง
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Validation error (เช่น จองล่วงหน้าหรือเวลาจองเกิน)
 *       403:
 *         description: Forbidden (ผู้ใช้ไม่อนุญาต)
 *       404:
 *         description: Room or User not found
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservation]
 *     responses:
 *       200:
 *         description: List of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Internal server error
 *
 * /reservations/{id}:
 *   get:
 *     summary: Get reservation by ID
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update reservation
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update
 *     responses:
 *       200:
 *         description: Reservation updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete reservation
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 *
 * /reservations/{id}/status:
 *   patch:
 *     summary: Update reservation status (Approve / Reject / Cancel)
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected, cancelled]
 *                 description: New status of the reservation
 *               note:
 *                 type: string
 *                 description: Optional note about status change
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         roomId:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             name: { type: string }
 *             location: { type: string }
 *         organizationId:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             name: { type: string }
 *         userId:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             name: { type: string }
 *             email: { type: string }
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected, cancelled]
 *         assignedStaff:
 *           type: object
 *           nullable: true
 *           properties:
 *             staffId: { type: string }
 *             name: { type: string }
 *             email: { type: string }
 *         questionAnswers:
 *           type: array
 *           items:
 *             type: object
 *         approvalLog:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               approvedBy: { type: string }
 *               status: { type: string }
 *               note: { type: string }
 *         googleCalendarEventId:
 *           type: string
 *           nullable: true
 */



