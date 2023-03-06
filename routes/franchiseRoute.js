const express = require('express');
const router = express.Router();
const franchiseController = require('../controllers/franchiseController');

router.get('/franchises', franchiseController.franchiseList);
router.get('/franchise/:id', franchiseController.getFranchise);

module.exports = router;
