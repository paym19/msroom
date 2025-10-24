const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  capacity: { type: Number, required: true },
  needApproval: { type: Boolean, default: false },

  availableDates: [
    {
      dayOfWeek: { type: String }, // e.g. 'Monday'
      startTime: { type: String }, // e.g. '09:00'
      endTime: { type: String }    // e.g. '18:00'
    }
  ],

  rules: {
    minAdvanceHours: { type: Number, default: 0 },
    maxHoursPerBooking: { type: Number, default: 4 },
    allowedUserType: [{ type: String }],
    customConditions: [
      {
        condition: { type: String },
        autoApprove: { type: Boolean, default: false }
      }
    ]
  },

  questionBox: [
    {
      question: { type: String },
      required: { type: Boolean, default: false }
    }
  ],

  googleCalendar: {
    calendarId: { type: String },
    syncEnabled: { type: Boolean, default: false }
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
