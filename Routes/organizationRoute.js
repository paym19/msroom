const express = require('express');
const router = express.Router();
const organizationController = require('../Controllers/organizationController');

// CRUD for Organization
router.post('/', organizationController.createOrganization);
router.get('/', organizationController.getAllOrganizations);
router.get('/:id', organizationController.getOrganizationById);
router.put('/:id', organizationController.updateOrganization);
router.delete('/:id', organizationController.deleteOrganization);

// Add or remove member
router.post('/:id/add-member', organizationController.addMember);
router.post('/:id/remove-member', organizationController.removeMember);

module.exports = router;
