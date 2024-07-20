const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateAccessToken = (id, name) => {
    return jwt.sign({ userID: id, name: name }, process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' });
};

// exports.loginController = async (req, res, next) => {
//     const { email, password } = req.body;
//     try {
//         const user = await Users.findOne({ where: { email } });

//         if (!user) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }

//         const passwordValid = await bcrypt.compare(password, user.password);
//         if (!passwordValid) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }

//         const token = generateAccessToken(user.id, user.name);
//         res.status(200).json({ token });
//     } catch (error) {
//         console.error('Login Error:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };


// exports.loginController = async (req, res, next) => {
//     const { email, password } = req.body;
//     try {
//         const user = await Users.findOne({ where: { email } });
//         if (!user || !bcrypt.compareSync(password, user.password)) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }

//         const token = jwt.sign(
//             { userID: user.id, name: user.name },
//             process.env.JWT_TOKEN_SECRET,
//             { expiresIn: '1h' }
//         );

//         res.status(200).json({ token, username: user.name });
//     } catch (error) {
//         console.error('Login Error:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };





exports.loginController = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({ where: { email } });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userID: user.id, name: user.name },
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, username: user.name });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
