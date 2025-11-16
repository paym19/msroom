const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const uploadController = require("../Controllers/uploadController");

// USER
router.post("/user", upload.single("image"), uploadController.uploadUserImage);
router.put("/user", upload.single("image"), uploadController.updateUserImage);
router.delete("/user", uploadController.deleteUserImage);

// ORGANIZATION
router.post("/organization/:id", upload.single("image"), uploadController.uploadOrganizationImage);
router.put("/organization/:id", upload.single("image"), uploadController.updateOrganizationImage);
router.delete("/organization/:id", uploadController.deleteOrganizationImage);

module.exports = router;

/**
 * @openapi
 * /uploads/user:
 *   post:
 *     summary: Upload user profile image
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Upload successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 user: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: No image uploaded
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update user profile image
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Update successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 user: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: No image uploaded
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete user profile image (from database only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile image removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *       400:
 *         description: User has no image
 *       500:
 *         description: Internal server error
 *
 * /uploads/organization/{id}:
 *   post:
 *     summary: Upload organization profile image
 *     tags: [Organization]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 organization: { $ref: '#/components/schemas/Organization' }
 *       400:
 *         description: No image uploaded
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update organization profile image
 *     tags: [Organization]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Update successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 organization: { $ref: '#/components/schemas/Organization' }
 *       400:
 *         description: No image uploaded
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete organization profile image (from database only)
 *     tags: [Organization]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Organization image removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *       400:
 *         description: Organization has no image
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         name: { type: string }
 *         email: { type: string }
 *         profileImage: { type: string, nullable: true }
 *
 *     Organization:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         name: { type: string }
 *         profileImage: { type: string, nullable: true }
 */


