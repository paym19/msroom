const Organization = require('../models/organization');
const User = require('../models/user');

// สร้างองค์กรใหม่
exports.createOrganization = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    //const testUserId = "672fbe8c12a45a2a3bcd1234"; 

    const organization = await Organization.create({
      name,
      description,
      createdBy: req.user ? req.user._id : null, // null 
      members: members || [],
    });

    res.status(201).json(organization);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึงข้อมูลองค์กรทั้งหมด
exports.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find().populate('members.userId', 'name email');
    res.status(200).json(organizations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึงองค์กรตาม ID
exports.getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id).populate('members.userId', 'name email');
    if (!organization)
      return res.status(404).json({ message: 'Organization not found' });

    res.status(200).json(organization);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// อัปเดตองค์กร
exports.updateOrganization = async (req, res) => {
  try {
    const { name, description } = req.body;

    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!organization)
      return res.status(404).json({ message: 'Organization not found' });

    res.status(200).json(organization);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ลบองค์กร
exports.deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndDelete(req.params.id);
    if (!organization)
      return res.status(404).json({ message: 'Organization not found' });

    res.status(200).json({ message: 'Organization deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// เพิ่มสมาชิก
exports.addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;

    const organization = await Organization.findById(req.params.id);
    if (!organization) return res.status(404).json({ message: 'Organization not found' });

    // ตรวจว่าผู้ใช้ยังไม่ได้อยู่ในสมาชิก
    const exists = organization.members.some(m => m.userId.toString() === userId);
    if (exists) return res.status(400).json({ message: 'User already a member' });

    organization.members.push({ userId, role });
    await organization.save();

    res.status(200).json(organization);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ลบสมาชิก
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const organization = await Organization.findById(req.params.id);
    if (!organization) return res.status(404).json({ message: 'Organization not found' });

    organization.members = organization.members.filter(m => m.userId.toString() !== userId);
    await organization.save();

    res.status(200).json(organization);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

