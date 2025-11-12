const express = require('express');
const router = express.Router();
const logController = require('../Controllers/logController');


router.get('/', logController.getLogs);
router.post('/', logController.createLog)


module.exports = router;
