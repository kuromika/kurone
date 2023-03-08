const express = require('express');
const router = express.Router();
const franchiseController = require('../controllers/franchiseController');

router.get('/franchises', franchiseController.franchiseList);

router.get('/franchise/create', franchiseController.getFranchiseCreate);
router.post('/franchise/create', franchiseController.postFranchiseCreate);

router.get('/franchise/delete/:id', franchiseController.getFranchiseDelete);
router.post('/franchise/delete/:id', franchiseController.postFranchiseDelete);

router.get('/franchise/:id', franchiseController.getFranchise);

module.exports = router;
