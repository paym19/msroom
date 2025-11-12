const mongoose = require('mongoose'); //เพิ่มมา
const Room = require('../models/room');
const Organization = require('../models/organization');
const { google } = require('googleapis');
const { createCalendarEvent } = require('../utils/googleCalendar');
const { getAuthorizedClient } = require('../utils/googleCalendar'); // ฟังก์ชันคืน oauth2Client


exports.createRoom = async (req, res) => {
  try {
    const {
      organizationId,
      name,
      description,
      location,
      capacity,
      needApproval,
      googleCalendar,
      questionBox
    } = req.body;

    // ต้อง login ก่อน
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: please login' });
    }

    // ตรวจ organization
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    const orgName = organization?.name || "Unknown Organization";

    // ข้อมูลเริ่มต้นของ Google Calendar
    let calendarData = { calendarId: '', syncEnabled: false };

    // ตรวจว่าผู้ใช้เป็นสมาชิกหรือ admin
   const isMember = organization.members.some(m => m.userId.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this organization' });
    }

    // สร้าง Calendar จริง ถ้า autoCreate = true
    if (googleCalendar && googleCalendar.autoCreate === true) {
      try {
        // รับ OAuth2 client ที่มี token ถูกต้อง
        const auth = getAuthorizedClient(); 
        if (!auth) throw new Error("No authorized Google client available");

        const calendar = google.calendar({ version: 'v3', auth });

        const response = await calendar.calendars.insert({
          requestBody: {
            summary: `Calendar - ${name}`,
            description: `ปฏิทินสำหรับห้อง "${name}" ขององค์กร ${orgName}`,
            timeZone: 'Asia/Bangkok',
          },
        });

        const newCalendar = response?.data;

        if (newCalendar && newCalendar.id) {
          calendarData = {
            calendarId: newCalendar.id,
            syncEnabled: true,
          };
          console.log(`สร้าง Google Calendar สำเร็จ: ${newCalendar.id}`);
        } else {
          console.warn('Google Calendar returned null or missing id, skipping');
        }
      } catch (error) {
        console.error('ไม่สามารถสร้าง Google Calendar ได้:', error.message);
      }
    } 
    // ถ้ามี calendarId ส่งมาเอง
    else if (googleCalendar && googleCalendar.calendarId) {
      calendarData = {
        calendarId: googleCalendar.calendarId,
        syncEnabled: true,
      };
    }

    // ตั้งค่า createdBy สำหรับทดสอบ
    //const testCreatorId = new mongoose.Types.ObjectId("68f9d6f693b1e8ff694efe25");

    // สร้าง Room
    const room = await Room.create({
      organizationId,
      name,
      description,
      location,
      capacity,
      needApproval: needApproval || false,
      googleCalendar: calendarData,
      questionBox: questionBox || [],
      rules: {},
      availableDates: [],
      createdBy: req.user ? req.user._id : null
    });

    res.status(201).json(room);

  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ error: err.message });
  }
};

// ดึงห้องทั้งหมด
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('organizationId', 'name');
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึงห้องตาม ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('organizationId', 'name');
    if (!room) return res.status(404).json({ message: 'Room not found' });

    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// อัปเดตห้อง
exports.updateRoom = async (req, res) => {
  try {
    const updates = req.body;
    const room = await Room.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });

    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ลบห้อง
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ตั้งกฎของห้อง
exports.setRoomRules = async (req, res) => {
  try {
    const { minAdvanceHours, maxHoursPerBooking, allowedUserType, customConditions } = req.body;

    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    room.rules = {
      minAdvanceHours: minAdvanceHours || room.rules.minAdvanceHours,
      maxHoursPerBooking: maxHoursPerBooking || room.rules.maxHoursPerBooking,
      allowedUserType: allowedUserType || room.rules.allowedUserType,
      customConditions: customConditions || room.rules.customConditions
    };

    await room.save();
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ตั้งวันที่และเวลาที่สามารถจองได้
exports.setAvailability = async (req, res) => {
  try {
    const { availableDates } = req.body; // array ของ { dayOfWeek, startTime, endTime }

    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    room.availableDates = availableDates;
    await room.save();
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

