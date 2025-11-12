const Log = require('../models/log');

exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find().populate('userId roomId organizationId');
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/** ฟังก์ชันสร้าง log ใช้ใน controller เท่านั้น */
exports.createLog = async ({ action, userId, roomId = null, organizationId = null, detail = '' }) => {
  try {
    const log = await Log.create({
      action,
      userId,
      roomId,
      organizationId,
      detail,
    });
    console.log('✅ Log created:', action);
    return log;
  } catch (err) {
    console.error('Error creating log:', err.message);
    throw err;
  }
};

