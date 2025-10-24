const Log = require('../models/log');

exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find().populate('userId roomId organizationId');
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

