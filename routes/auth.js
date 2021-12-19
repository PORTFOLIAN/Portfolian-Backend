const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/:coperation/access', authController.getAccessToken);
router.post('/:coperation/test', authController.getAccessToken_test);
router.get('/verify/jwt/test', authController.verifyJWT_test);
router.post('/refresh', authController.refreshAccessToken);

module.exports = router;