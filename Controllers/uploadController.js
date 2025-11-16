const cloudinary = require('../config/cloudinary');
const User = require('../models/user');
const Organization = require('../models/organization');

// ⭐ Upload รูปโปรไฟล์ของ User
exports.uploadUserImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    const result = await cloudinary.uploader.upload_stream(
      { folder: 'users' },
      async (error, uploadResult) => {
        if (error) return res.status(500).json({ error });

        const user = await User.findByIdAndUpdate(
          req.user._id,
          { profileImage: uploadResult.secure_url },
          { new: true }
        );

        res.json({ message: 'Upload successful', user });
      }
    );

    result.end(req.file.buffer);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateUserImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    // ✨ อัปโหลดรูปใหม่
    const upload = cloudinary.uploader.upload_stream(
      { folder: "users" },
      async (error, result) => {
        if (error) return res.status(500).json({ error });

        const user = await User.findByIdAndUpdate(
          req.user._id,
          { profileImage: result.secure_url },
          { new: true }
        );

        res.json({ message: "Update successful", user });
      }
    );

    upload.end(req.file.buffer);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteUserImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.profileImage)
      return res.status(400).json({ message: "User has no image" });

    // ❗ ไม่สามารถลบจาก Cloudinary ได้ เพราะไม่ได้เก็บ public_id
    // จะลบแค่จาก Database
    user.profileImage = null;
    await user.save();

    res.json({ message: "Profile image removed from user record only" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ⭐ Upload รูปโปรไฟล์ Organization
exports.uploadOrganizationImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    const result = await cloudinary.uploader.upload_stream(
      { folder: 'organizations' },
      async (error, uploadResult) => {
        if (error) return res.status(500).json({ error });

        const organization = await Organization.findByIdAndUpdate(
          req.params.id,
          { profileImage: uploadResult.secure_url },
          { new: true }
        );

        res.json({ message: 'Upload successful', organization });
      }
    );

    result.end(req.file.buffer);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateOrganizationImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const upload = cloudinary.uploader.upload_stream(
      { folder: "organizations" },
      async (error, result) => {
        if (error) return res.status(500).json({ error });

        const organization = await Organization.findByIdAndUpdate(
          req.params.id,
          { profileImage: result.secure_url },
          { new: true }
        );

        res.json({ message: "Update successful", organization });
      }
    );

    upload.end(req.file.buffer);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteOrganizationImage = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization || !organization.profileImage)
      return res.status(400).json({ message: "Organization has no image" });

    // ❗ ไม่สามารถลบจาก cloudinary เพราะไม่มี public_id
    organization.profileImage = null;
    await organization.save();

    res.json({ message: "Organization image removed from database only" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};






