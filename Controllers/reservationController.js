const { createCalendarEvent, deleteCalendarEvent } = require('../utils/googleCalendar');
const Reservation = require('../models/reservation');
const User = require('../models/user');
const Room = require('../models/room');
const Organization = require('../models/organization');
const Notification = require('../models/notification');
const { sendEmail } = require('../utils/sendEmail');


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
      assignedStaff: null, // ยังไม่มีผู้ดูแลตอนสร้าง
    });

    const staffList = organization.members.filter(m => ['admin', 'staff'].includes(m.role));
    const staffIds = staffList.map(m => m.userId._id);

    const notification = await Notification.create({
      title: `มีการจองห้องใหม่จาก ${user.name}`,
      message: `ผู้ใช้ ${user.email} ได้ทำการจองห้อง "${room.name}" ในวันที่ ${start.toLocaleString()} ถึง ${end.toLocaleString()}`,
      userId: user._id,
      organizationId,
      roomId,
    });

     for (const staff of staffList) {
      await sendEmail(
        staff.userId.email,
        'แจ้งเตือนการจองห้องใหม่',
        `มีการจองห้อง "${room.name}" โดย ${user.name}\n\nกรุณาเข้าสู่ระบบเพื่ออนุมัติหรือปฏิเสธการจองนี้`
      );
    }

    res.status(201).json({
      message: 'จองห้องสำเร็จ รอการอนุมัติจากผู้ดูแล',
      reservation,
      notification,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

  // ถ้าเปิดใช้งาน Google Calendar sync
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
      console.error('⚠️ ไม่สามารถสร้างอีเวนต์บน Google Calendar:', err.message);
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

// อัปเดตสถานะการจอง (approve, reject, cancel)
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status, note } = req.body; // 'approved' | 'rejected' | 'cancelled'
    const allowedStatus = ['approved', 'rejected', 'cancelled'];

    if (!allowedStatus.includes(status))
      return res.status(400).json({ message: 'Invalid status value' });

    const reservation = await Reservation.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('roomId', 'name')
      .populate('organizationId', 'name');

    if (!reservation)
      return res.status(404).json({ message: 'Reservation not found' });

    const staff = req.user; // ผู้ที่อนุมัติ ต้องผ่าน middleware auth

    // === กรณีอนุมัติ ===
    if (status === 'approved') {
      reservation.status = 'approved';
      reservation.assignedStaff = {
        staffId: staff._id,
        name: staff.name,
        email: staff.email
      };
      reservation.approvalLog.push({
        approvedBy: staff._id,
        status: 'approved',
        note: note || 'อนุมัติการจอง'
      });

      // สร้าง Notification
      await Notification.create({
        title: 'การจองได้รับการอนุมัติ',
        message: `ห้อง "${reservation.roomId.name}" ได้รับการอนุมัติแล้วโดย ${staff.name}`,
        userId: reservation.userId._id,
        organizationId: reservation.organizationId._id,
        roomId: reservation.roomId._id,
      });

      // ส่งอีเมลแจ้งผู้จอง
      await sendEmail(
        reservation.userId.email,
        '🎉 การจองของคุณได้รับการอนุมัติ',
        `สวัสดี ${reservation.userId.name}\n\nห้อง "${reservation.roomId.name}" ของคุณได้รับการอนุมัติแล้วโดย ${staff.name}.`
      );
    }

    // === กรณีปฏิเสธ ===
    if (status === 'rejected') {
      reservation.status = 'rejected';
      reservation.approvalLog.push({
        approvedBy: staff._id,
        status: 'rejected',
        note: note || 'ปฏิเสธการจอง'
      });

      await Notification.create({
        title: 'การจองถูกปฏิเสธ',
        message: `ห้อง "${reservation.roomId.name}" ถูกปฏิเสธโดย ${staff.name}`,
        userId: reservation.userId._id,
        organizationId: reservation.organizationId._id,
        roomId: reservation.roomId._id,
      });

      await sendEmail(
        reservation.userId.email,
        'การจองของคุณถูกปฏิเสธ',
        `สวัสดี ${reservation.userId.name}\n\nห้อง "${reservation.roomId.name}" ของคุณถูกปฏิเสธโดย ${staff.name}.`
      );
    }

    // === กรณียกเลิกโดยผู้ใช้ ===
    if (status === 'cancelled') {
      reservation.status = 'cancelled';
      reservation.approvalLog.push({
        approvedBy: reservation.userId._id,
        status: 'cancelled',
        note: note || 'ผู้ใช้ยกเลิกการจอง'
      });

      await Notification.create({
        title: 'ผู้ใช้ยกเลิกการจอง',
        message: `${reservation.userId.name} ได้ยกเลิกการจองห้อง "${reservation.roomId.name}"`,
        organizationId: reservation.organizationId._id,
        roomId: reservation.roomId._id,
      });
    }

    await reservation.save();

    res.status(200).json({
      message: `Reservation ${status} successfully`,
      reservation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }

  // ถ้ามี Google Calendar Event ให้ลบออก
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
      console.error('⚠️ ลบอีเวนต์จาก Google Calendar ไม่สำเร็จ:', err.message);
    }
  }

};