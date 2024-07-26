const sequelize = require("../util/database");
const Message = require('../models/message');
const User = require('../models/users');
exports.getMessages = async (req, res) => {
    const { groupId } = req.params;

    try {
        const messages = await Message.findAll({
            where: { groupId }
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'An error occurred while fetching messages.' });
    }
};

exports.sendMessage = async (req, res) => {
    const { groupId } = req.params;
    const { message } = req.body;
    const userId = req.user.id; // Assuming req.user contains authenticated user info

    if (!message && (!req.files || req.files.length === 0)) {
        return res.status(400).json({ error: 'No message or files to send.' });
    }

    try {
        // Create a new message
        const newMessage = await Message.create({
            groupId,
            userId,
            message,
            // If files are included, handle file saving logic here
        });

        // Handle file uploads if there are any
        if (req.files) {
            req.files.forEach(file => {
                // Process each file as needed
                // You may want to save file info to the database or handle it differently
                // For example:
                // await File.create({ messageId: newMessage.id, filePath: file.path });
            });
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'An error occurred while sending the message.' });
    }
};
