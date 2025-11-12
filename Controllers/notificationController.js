const Notification = require('../models/notification');
const { sendEmail } = require('../utils/sendEmail');

exports.createNotification = async (req, res) => {
  try {
    const { event, title, message, recipientId, organizationId, roomId, email } = req.body;

    // ตรวจว่ามีค่า required ครบ
    if (!event || !recipientId) {
      return res.status(400).json({ error: "`event` and `recipientId` are required" });
    }

    const notification = await Notification.create({
      event,
      title,
      message,
      recipientId,
      organizationId,
      roomId,
    });

    // ส่ง email ถ้ามี
    if (email) {
      try {
        await sendEmail(email, title, message);
        console.log(`✅ Email sent to ${email}`);
      } catch (err) {
        console.error(`⚠️ Failed to send email: ${err.message}`);
      }
    }

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึง Notification ทั้งหมด
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('recipientId', 'name email')
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
      .populate('recipientId', 'name email')
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

