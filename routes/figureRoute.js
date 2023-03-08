const express = require('express')
const router = express.Router();
const figureController = require('../controllers/figureController.js');

router.get("/figures", figureController.figureList);

router.get("/figure/create", figureController.getCreateFigure);
router.post("/figure/create", figureController.postCreateFigure);

router.get("/figure/delete/:id", figureController.getDeleteFigure);
router.post("/figure/delete/:id", figureController.postDeleteFigure);


router.get("/figure/:id", figureController.getFigure);



module.exports = router;
