const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  profileImage: { type: String }, // ⭐ เพิ่ม
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  organizations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
