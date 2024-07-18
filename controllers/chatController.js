const sequelize = require("../util/database");
const Message = require('../models/message');

exports.postTextMessage = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { message } = req.body;
        const savedTextMsg = await req.user.createMessage({ message }, { transaction: t });

        await t.commit();
        res.status(201).json({ msgText: savedTextMsg.message });
    } catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
        res.status(500).json({ message: 'Sending message failed' });
    }
};

exports.getMessages = async (req, res, next) => {
    try {
        const messages = await Message.findAll();
        res.status(200).json({ messages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Fetching messages failed' });
    }
};
