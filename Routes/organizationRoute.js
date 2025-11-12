const express = require('express');
const router = express.Router();
const organizationController = require('../Controllers/organizationController');
const { protect } = require('../middlewares/authMiddleware'); // ✅ import มาด้วย

router.post('/', organizationController.createOrganization); //protect
router.get('/', organizationController.getAllOrganizations);
router.get('/:id', organizationController.getOrganizationById);
router.put('/:id',organizationController.updateOrganization); //protect
router.delete('/:id',organizationController.deleteOrganization); //protect

router.post('/:id/add-member', organizationController.addMember); //protect
router.post('/:id/remove-member', organizationController.removeMember); //protect

module.exports = router;
