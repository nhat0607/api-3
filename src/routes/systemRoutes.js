const express = require('express');
const router = express.Router();
const { backupMongoDB, restoreMongoDB } = require('../controllers/systemController');

router.post('/backup', backupMongoDB);

router.post('/restore', restoreMongoDB);

module.exports = router;
