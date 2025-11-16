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
 * /upload/user:
 *   post:
 *     summary: Upload user profile image
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 */

/**
 * @openapi
 * /upload/user:
 *   put:
 *     summary: Update user profile image
 *     tags: [Upload]
 */

/**
 * @openapi
 * /upload/user:
 *   delete:
 *     summary: Delete user image
 *     tags: [Upload]
 */

/**
 * @openapi
 * /upload/organization/{id}:
 *   post:
 *     summary: Upload organization image
 *     tags: [Upload]
 */

/**
 * @openapi
 * /upload/organization/{id}:
 *   put:
 *     summary: Update organization image
 *     tags: [Upload]
 */

/**
 * @openapi
 * /upload/organization/{id}:
 *   delete:
 *     summary: Delete organization image
 *     tags: [Upload]
 */
