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
 *     summary: Create a new organization
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               members:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userId: { type: string }
 *                     role: { type: string }
 *     responses:
 *       201:
 *         description: Organization created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: Get all organizations
 *     tags: [Organization]
 *     responses:
 *       200:
 *         description: List of organizations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Organization'
 *       500:
 *         description: Internal server error
 *
 * /organizations/{id}:
 *   get:
 *     summary: Get organization by ID
 *     tags: [Organization]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Organization details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update organization
 *     tags: [Organization]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Organization ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Organization updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete organization
 *     tags: [Organization]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Organization deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Internal server error
 *
 * /organizations/{id}/members:
 *   post:
 *     summary: Add a member to an organization
 *     tags: [Organization]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Organization ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - role
 *             properties:
 *               userId: { type: string }
 *               role: { type: string }
 *     responses:
 *       200:
 *         description: Member added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       400:
 *         description: User already a member
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Remove a member from an organization
 *     tags: [Organization]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Organization ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId: { type: string }
 *     responses:
 *       200:
 *         description: Member removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     Organization:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         name: { type: string }
 *         description: { type: string }
 *         createdBy: { type: string, nullable: true }
 *         members:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: object
 *                 properties:
 *                   _id: { type: string }
 *                   name: { type: string }
 *                   email: { type: string }
 *               role: { type: string }
 */



