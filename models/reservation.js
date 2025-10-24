const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },

  questionAnswers: [
    {
      question: { type: String },
      answer: { type: String }
    }
  ],

  assignedStaff: {
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    email: { type: String }
  },

  approvalLog: [
    {
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['approved', 'rejected'] },
      timestamp: { type: Date, default: Date.now },
      note: { type: String }
    }
  ],

  googleCalendarEventId: { type: String }

}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
