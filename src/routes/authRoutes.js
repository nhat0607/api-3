const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const sendEmailMiddleware = require('../middlewares/gmailMiddleware');

// Route đăng ký người dùng
router.post('/register', authController.register);

router.post(
    '/register-hotel',
    sendEmailMiddleware, // Sử dụng middleware đã chỉnh sửa
    authController.registerhotel
);


// Route đăng nhập người dùng
router.post('/login', authController.login);



module.exports = router;
