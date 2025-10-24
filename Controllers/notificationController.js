const Notification = require('../models/notification');

// สร้าง Notification ใหม่
exports.createNotification = async (req, res) => {
  try {
    const { title, message, userId, organizationId, roomId } = req.body;

    const notification = await Notification.create({
      title,
      message,
      userId,
      organizationId,
      roomId,
    });

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึง Notification ทั้งหมด
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('userId', 'name email')
      .populate('organizationId', 'name')
      .populate('roomId', 'name');

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึง Notification ตาม ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('organizationId', 'name')
      .populate('roomId', 'name');

    if (!notification)
      return res.status(404).json({ message: 'Notification not found' });

    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ลบ Notification ตาม ID
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification)
      return res.status(404).json({ message: 'Notification not found' });

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

