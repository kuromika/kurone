const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController.js');

router.get("/characters", characterController.characterList);
router.get("/character/create", characterController.getCharacterCreate);
router.get("/character/:id", characterController.getCharacter);

module.exports = router;
