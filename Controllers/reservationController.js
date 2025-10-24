const Reservation = require('../models/reservation');
const User = require('../models/user');
const Room = require('../models/room');
const Organization = require('../models/organization');

// สร้างการจองใหม่
exports.createReservation = async (req, res) => {
  try {
    const { roomId, organizationId, userId, startTime, endTime, answers } = req.body;

    // ตรวจสอบ room และ user ก่อน
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const reservation = await Reservation.create({
      roomId,
      organizationId,
      userId,
      startTime,
      endTime,
      answers,
      status: room.needApproval ? 'pending' : 'approved',
    });

    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึงการจองทั้งหมด
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('userId', 'name email')
      .populate('roomId', 'name location')
      .populate('organizationId', 'name');

    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึงการจองตาม ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('roomId', 'name location')
      .populate('organizationId', 'name');

    if (!reservation)
      return res.status(404).json({ message: 'Reservation not found' });

    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// อัปเดตการจอง
exports.updateReservation = async (req, res) => {
  try {
    const updates = req.body;

    const reservation = await Reservation.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!reservation)
      return res.status(404).json({ message: 'Reservation not found' });

    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ลบการจอง
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation)
      return res.status(404).json({ message: 'Reservation not found' });

    res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// อัปเดตสถานะการจอง (approve, reject, cancel)
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body; // ค่าที่ส่งมา: 'approved', 'rejected', 'cancelled'
    const allowedStatus = ['approved', 'rejected', 'cancelled'];

    if (!allowedStatus.includes(status))
      return res.status(400).json({ message: 'Invalid status value' });

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    reservation.status = status;
    await reservation.save();

    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

