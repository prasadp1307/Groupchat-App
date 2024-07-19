const sequelize = require("../util/database");
const Message = require('../models/message');
const User = require('../models/users');

exports.postTextMessage = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { message } = req.body;
        console.log('Received message:', message);

        const savedTextMsg = await Message.create({
            message,
            userId: req.user.id // Associate the message with the user
        }, { transaction: t });

        await t.commit();
        res.status(200).json({ msgText: savedTextMsg.message, username: req.user.name });
    } catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
        res.status(500).json({ message: 'Sending message failed' });
    }
}

exports.getTextMessages = async (req, res, next) => {
    try {
        const messages = await Message.findAll({
            include: {
                model: User,
                attributes: ['name'] // Include the user's name
            }
        });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
