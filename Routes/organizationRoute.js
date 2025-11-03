const express = require('express');
const router = express.Router();
const organizationController = require('../Controllers/organizationController');
const { protect } = require('../middlewares/authMiddleware'); // ✅ import มาด้วย

router.post('/', protect, organizationController.createOrganization);
router.get('/', organizationController.getAllOrganizations);
router.get('/:id', organizationController.getOrganizationById);
router.put('/:id', protect, organizationController.updateOrganization);
router.delete('/:id', protect, organizationController.deleteOrganization);

router.post('/:id/add-member', protect, organizationController.addMember);
router.post('/:id/remove-member', protect, organizationController.removeMember);

module.exports = router;
