const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Hotel = require('../models/hotel'); // Thêm import Hotel model
// const mail = require('nodemailer');
// Đăng ký người dùng

exports.register = async (req, res) => {
    const { name, email, password, country, phonenumber, role } = req.body;

    try {
        // Kiểm tra xem email đã tồn tại chưa
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Email đã tồn tại',
            });
        }

        // Tạo người dùng mới với vai trò mặc định là 'customer'
        const user = await User.create({
            name,
            email,
            password,
            country,
            phonenumber,
            role: role || 'customer', // Nếu không có vai trò, mặc định là 'customer'
        });

        // Tạo JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        // Trả về thông tin người dùng và token
        res.status(201).json({
            success: true,
            token,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi đăng ký',
            error: error.message,
        });
    }
};

// Đăng ký người dùng
exports.registerhotel = async (req, res) => {
    const { name, email, password, 
        country, 
        phonenumber, 
        role, hotel } = req.body;
        // console.log(name);
        // console.log(email);
        // console.log(password);
        // console.log(role);
        // console.log(hotel);
        // console.log(hotel.name);
        // console.log(hotel.location);

    try {
        console.log('test 1');
        const userExists = await User.findOne({ email });
        console.log(userExists);
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Email đã tồn tại',
            });
        }
        console.log('test 2');
        if (role === 'hotelOwner' && (!hotel || !hotel.name || !hotel.location)) {
            console.log('success');
            return res.status(400).json({
                success: false,
                message: 'Thông tin khách sạn là bắt buộc đối với vai trò hotelOwner.',
            });

        }
        console.log('test 3');
        const user = await User.create({
            name,
            email,
            password,
            country,
            phonenumber,
            role: role || 'customer',
        });
        console.log('test 4');
        console.log(user);
        let newHotel = null;
        if (role === 'hotelOwner') {

            newHotel = await Hotel.create({
                name: hotel.name,
                location: hotel.location,
                rating: hotel.rating || 0,
                owner: user._id, 
                amenities: hotel.amenities || [],
            });
            console.log(newHotel);
        }

        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        //     expiresIn: process.env.JWT_EXPIRE,
        // });

        res.status(201).json({
            success: true,
            token,
            user,
            hotel: newHotel, 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi đăng ký',
            error: error.message,
        });
    }
};

// Đăng nhập người dùng
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Kiểm tra xem người dùng có tồn tại hay không
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(402).json({
                success: false,
                message: 'Email hoặc mật khẩu không đúng',
            });
        }

        // Kiểm tra mật khẩu
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(403).json({
                success: false,
                message: 'Email hoặc mật khẩu không đúng',
            });
        }

        // Tạo JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        // Trả về token và thông tin người dùng
        res.status(200).json({
            success: true,
            token,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi đăng nhập',
            error: error.message,
        });
    }
};
