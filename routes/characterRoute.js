const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController.js');

router.get("/characters", characterController.characterList);

module.exports = router;
