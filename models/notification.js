const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' },

  event: {
    type: String,
    enum: [
      'reserve_created',
      'reserve_approved',
      'reserve_rejected',
      'reserve_cancelled'
    ],
    required: true
  },

  subject: { type: String },
  body: { type: String },

  sender: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    email: { type: String }
  },

  status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
  sentAt: { type: Date }

}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
