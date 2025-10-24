const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['createRoom', 'updateRoom', 'reserve', 'approve', 'cancel'],
    required: true
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  timestamp: { type: Date, default: Date.now },
  detail: { type: String }
}, { timestamps: false }); // ใช้ timestamp แบบ manual (timestamp field มีอยู่แล้ว)

module.exports = mongoose.model('Log', logSchema);

