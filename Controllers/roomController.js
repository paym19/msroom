const Room = require('../models/room');
const Organization = require('../models/organization');
const { createCalendarEvent } = require('../utils/googleCalendar');


// สร้างห้องใหม่
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

    const organization = await Organization.findById(organizationId);
    if (!organization) return res.status(404).json({ message: 'Organization not found' });

        // ข้อมูลเริ่มต้นของ Google Calendar
    let calendarData = { calendarId: '', syncEnabled: false };

    // ถ้า user ขอให้ระบบสร้าง Calendar อัตโนมัติ
    if (googleCalendar && googleCalendar.autoCreate === true) {
      try {
        const newCalendar = await createCalendarEvent('primary', {
          summary: `Calendar - ${name}`,
          description: `ปฏิทินสำหรับห้อง "${name}" ขององค์กร ${organization.name}`,
        });

        calendarData = {
          calendarId: newCalendar.id,
          syncEnabled: true,
        };

        console.log(`✅ สร้าง Google Calendar สำเร็จ: ${newCalendar.id}`);
      } catch (error) {
        console.error('⚠️ ไม่สามารถสร้าง Google Calendar ได้:', error.message);
      }
    } 
    // ถ้ามีการส่ง calendarId มาเอง (ใช้ Calendar เดิม)
    else if (googleCalendar && googleCalendar.calendarId) {
      calendarData = {
        calendarId: googleCalendar.calendarId,
        syncEnabled: true,
      };
    }

    const room = await Room.create({
      organizationId,
      name,
      description,
      location,
      capacity,
      needApproval: needApproval || false,
      googleCalendar: googleCalendar || { calendarId: '', syncEnabled: false },
      questionBox: questionBox || [],
      rules: {},
      availableDates: [],
      createdBy: req.user ? req.user._id : null
    });

    res.status(201).json(room);
  } catch (err) {
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

