const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            console.log('No Authorization header');
            return res.status(401).json({ message: 'Token not provided' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token from header:', token);

        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        console.log('Decoded Token:', decodedToken);

        const user = await User.findByPk(decodedToken.userID);
        if (!user) {
            console.log('User not found for decoded token:', decodedToken);
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication Error:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};
