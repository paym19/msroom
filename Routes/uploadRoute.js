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
