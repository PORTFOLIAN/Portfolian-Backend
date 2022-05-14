const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { validateAccessToken } = require('../middlewares/validateAccessToken');

// 소셜로그인
router.post('/login/apple', authController.getAccessToken_apple);
router.post('/:coperation/access', authController.getAccessToken);
router.post('/:coperation/test', authController.getAccessToken_test);

// 유효성 검사(test)
router.get('/verify/jwt/test', authController.verifyJWT_test);

// accessToken 갱신
router.post('/refresh', authController.refreshAccessToken);

// 로그아웃
router.patch('/logout', validateAccessToken, authController.logout);

module.exports = router;