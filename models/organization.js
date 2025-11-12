const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //true
  members: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
      role: { type: String, enum: ['admin', 'staff'], required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);
