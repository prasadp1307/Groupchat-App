const Users = require('../models/users.js');
const bcrypt = require('bcrypt');

exports.signupController = async (req, res) => {
    const data = req.body;
    console.log('Received signup data:', data);

    try {
        const existingUser = await Users.findOne({ where: { email: data.email } });

        if (existingUser) {
            console.log('User already exists:', data.email);
            return res.status(302).json({ message: 'User already exists' });
        }

        const saltRounds = 10;
        bcrypt.hash(data.password, saltRounds, async (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ message: 'Error processing request' });
            }

            try {
                const newUser = await Users.create({
                    name: data.name,
                    email: data.email,
                    number: data.number,
                    password: hash
                });
                console.log('User registered successfully:', newUser);
                res.status(200).json({ message: 'Successfully created a new user' });
            } catch (error) {
                console.error('Error creating user:', error);
                res.status(500).json({ message: 'Error creating user' });
            }
        });
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({ message: 'Error processing request' });
    }
};

