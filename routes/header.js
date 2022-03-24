const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { validateAccessToken } = require('../middlewares/validateAccessToken');

router.get('/', validateAccessToken, userController.getUserHeader);

module.exports = router;
