const express = require('express');
const router = express.Router();
const franchiseController = require('../controllers/franchiseController');

router.get('/franchises', franchiseController.franchiseList);
router.get('/franchise/create', franchiseController.getFranchiseCreate);
router.post('/franchise/create', franchiseController.postFranchiseCreate);
router.get('/franchise/:id', franchiseController.getFranchise);

module.exports = router;
