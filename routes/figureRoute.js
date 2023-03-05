const express = require('express')
const router = express.Router();
const figureController = require('../controllers/figureController.js');

router.get("/figures", figureController.figureList);

module.exports = router;
