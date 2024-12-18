
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Route để tạo đơn hàng
router.post('/create', protect, orderController.createOrder);
router.post('/callback', orderController.handleZaloPayCallback);

router.get('/order/:hotelId', orderController.getOrderByHotelId);

module.exports = router;
