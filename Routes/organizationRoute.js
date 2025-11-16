const express = require('express');
const router = express.Router();
const organizationController = require('../Controllers/organizationController');
const { protect } = require('../middlewares/authMiddleware'); // ✅ import มาด้วย

router.post('/', organizationController.createOrganization); 
router.get('/', organizationController.getAllOrganizations);
router.get('/:id', organizationController.getOrganizationById);
router.put('/:id',organizationController.updateOrganization); 
router.delete('/:id',organizationController.deleteOrganization); 

router.post('/:id/add-member', organizationController.addMember); 
router.post('/:id/remove-member', organizationController.removeMember); 

module.exports = router;

/**
 * @openapi
 * /organizations:
 *   post:
 *     summary: Create organization
 *     tags: [Organization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               members:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userId: { type: string }
 *                     role: { type: string }
 *     responses:
 *       201:
 *         description: Organization created
 */

/**
 * @openapi
 * /organizations:
 *   get:
 *     summary: Get all organizations
 *     tags: [Organization]
 *     responses:
 *       200:
 *         description: List of organizations
 */

/**
 * @openapi
 * /organizations/{id}:
 *   get:
 *     summary: Get organization by ID
 *     tags: [Organization]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Organization data
 */

/**
 * @openapi
 * /organizations/{id}:
 *   put:
 *     summary: Update organization
 *     tags: [Organization]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Organization updated
 */

/**
 * @openapi
 * /organizations/{id}:
 *   delete:
 *     summary: Delete organization
 *     tags: [Organization]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Organization deleted
 */

/**
 * @openapi
 * /organizations/{id}/add-member:
 *   post:
 *     summary: Add member to organization
 *     tags: [Organization]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId: { type: string }
 *               role: { type: string }
 *     responses:
 *       200:
 *         description: Member added
 */

/**
 * @openapi
 * /organizations/{id}/remove-member:
 *   post:
 *     summary: Remove member from organization
 *     tags: [Organization]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId: { type: string }
 *     responses:
 *       200:
 *         description: Member removed
 */

