const express = require('express')
const router = express.Router();
const figureController = require('../controllers/figureController.js');

router.get("/figures", figureController.figureList);
router.get("/figure/create", figureController.getCreateFigure);
router.get("/figure/:id", figureController.getFigure);


module.exports = router;
