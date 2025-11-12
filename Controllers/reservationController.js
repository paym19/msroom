const { createCalendarEvent, deleteCalendarEvent } = require('../utils/googleCalendar');
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

    const rules = room.rules || {};

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    const hoursDiff = (start - now) / (1000 * 60 * 60);
    if (rules.minAdvanceHours && hoursDiff < rules.minAdvanceHours) {
      return res.status(400).json({
        message: `ต้องจองล่วงหน้าอย่างน้อย ${rules.minAdvanceHours} ชั่วโมง`,
      });
    }

    const durationHours = (end - start) / (1000 * 60 * 60);
    if (rules.maxHoursPerBooking && durationHours > rules.maxHoursPerBooking) {
      return res.status(400).json({
        message: `ระยะเวลาการจองเกิน ${rules.maxHoursPerBooking} ชั่วโมง`,
      });
    }

    if (
      rules.allowedUserType &&
      Array.isArray(rules.allowedUserType) &&
      rules.allowedUserType.length > 0 &&
      !rules.allowedUserType.includes(user.role)
    ) {
      return res.status(403).json({
        message: 'ประเภทผู้ใช้ของคุณไม่ได้รับอนุญาตให้จองห้องนี้',
      });
    }

    const custom = rules.customConditions || {};

    if (custom.allowedEmailDomains && Array.isArray(custom.allowedEmailDomains)) {
      const domain = user.email.split('@')[1];
      if (!custom.allowedEmailDomains.includes(domain)) {
        return res.status(403).json({
          message: `ไม่อนุญาตให้ใช้ email โดเมนนี้ (${domain}) จองห้องนี้`,
        });
      }
    }

    if (custom.disallowedDays && Array.isArray(custom.disallowedDays)) {
      const dayName = start.toLocaleDateString('en-US', { weekday: 'long' });
      if (custom.disallowedDays.includes(dayName)) {
        return res.status(403).json({
          message: `ไม่สามารถจองห้องนี้ในวัน ${dayName} ได้`,
        });
      }
    }

    if (custom.minUserLevel && user.level < custom.minUserLevel) {
      return res.status(403).json({
        message: `ระดับผู้ใช้ของคุณ (${user.level}) ต่ำกว่าที่กำหนด (${custom.minUserLevel})`,
      });
    }
  

    const reservation = await Reservation.create({
      roomId,
      organizationId,
      userId,
      startTime,
      endTime,
      questionAnswers: answers,
      status: room.needApproval ? 'pending' : 'approved',
      assignedStaff: null,
    });

    res.status(201).json({
      message: 'Reservation created successfully',
      reservation,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

  // ถ้าเปิดใช้งาน Google Calendar sync ก็สร้าง event ตามเดิม
  if (room.googleCalendar && room.googleCalendar.syncEnabled && room.googleCalendar.calendarId) {
    try {
      const event = {
        summary: `การจองห้อง: ${room.name}`,
        description: `ผู้จอง: ${user.name} (${user.email})`,
        start: { dateTime: new Date(startTime).toISOString(), timeZone: 'Asia/Bangkok' },
        end: { dateTime: new Date(endTime).toISOString(), timeZone: 'Asia/Bangkok' },
      };
      const googleEvent = await createCalendarEvent(room.googleCalendar.calendarId, event);
      reservation.googleCalendarEventId = googleEvent.id;
      await reservation.save();
    } catch (err) {
      console.error('ไม่สามารถสร้างอีเวนต์บน Google Calendar:', err.message);
    }
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

exports.updateReservationStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const allowedStatus = ['approved', 'rejected', 'cancelled'];

    if (!allowedStatus.includes(status))
      return res.status(400).json({ message: 'Invalid status value' });

    const reservation = await Reservation.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('roomId', 'name')
      .populate('organizationId', 'name');

    if (!reservation)
      return res.status(404).json({ message: 'Reservation not found' });

    const staff = req.user; // ผ่าน middleware auth

    reservation.status = status;
    if (status === 'approved') {
      reservation.assignedStaff = {
        staffId: staff._id,
        name: staff.name,
        email: staff.email
      };
    }

    reservation.approvalLog.push({
      approvedBy: staff._id,
      status,
      note: note || `Status updated to ${status}`,
    });

    await reservation.save();

    res.status(200).json({
      message: `Reservation ${status} successfully`,
      reservation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }

  // ลบ Google Calendar event ถ้า reject หรือ cancel
  if (
    ['rejected', 'cancelled'].includes(status) &&
    reservation.googleCalendarEventId &&
    reservation.roomId.googleCalendar &&
    reservation.roomId.googleCalendar.syncEnabled
  ) {
    try {
      await deleteCalendarEvent(
        reservation.roomId.googleCalendar.calendarId,
        reservation.googleCalendarEventId
      );
    } catch (err) {
      console.error('ลบอีเวนต์จาก Google Calendar ไม่สำเร็จ:', err.message);
    }
  }
};
