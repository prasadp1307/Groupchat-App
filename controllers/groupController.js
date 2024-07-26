const sequelize = require("../util/database");
const { v4: uuidv4 } = require('uuid');
const Group = require('../models/group');
const Member = require('../models/member');
const Message = require('../models/message'); 
const { where } = require("sequelize");


exports.createGroup = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const groupData = {
            name: req.body.groupName,
            inviteLink: uuidv4(),
            memberCount: 1,
            userId: req.user.id
        };

        console.log('Creating group with data:', groupData);

        const groupCreated = await Group.create(groupData, { transaction: t });

        await Member.create({
            rank: 'Owner',
            userId: req.user.id,
            groupId: groupCreated.id,
            name: req.user.name  // Assuming you want to use the user's name for the member's name
        }, { transaction: t });

        await t.commit();
        res.status(200).json(groupCreated);
    } catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
        res.status(500).json({ error: 'An error occurred while creating the group.' });
    }
};


exports.joinedGroup = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const members = await req.user.getMembers({ transaction: t });
        const allJoinedGroups = await Promise.all(members.map(member => member.getGroup({ transaction: t })));

        await t.commit();
        res.status(200).json(allJoinedGroups);
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
        res.status(500).json({ error: 'An error occurred while fetching joined groups.' });
    }
}

exports.openGroup = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const groupId = req.params.id;
        const groupDetails = await Group.findByPk(groupId, { transaction: t });

        await t.commit();
        res.status(200).json({ groupDetails: groupDetails });
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
        res.status(500).json({ error: 'An error occurred while opening the group.' });
    }
}

exports.groupDetails = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const groupToken = req.params.inviteId;
        const groupDetails = await Group.findAll({
            where: { inviteLink: groupToken }
        }, { transaction: t });

        await t.commit();
        res.status(200).json(groupDetails[0]);
    }
    catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
        res.status(500).json({ error: 'An error occurred while fetching group details.' });
    }
}

exports.joinMember = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const groupId = req.params.groupId;

        const [memberObj, created] = await Member.findOrCreate({
            where: {
                groupId: groupId,
                userId: req.user.id
            },
            defaults: { rank: 'Member' },
            transaction: t
        });

        if (created) {
            await Group.update(
                { memberCount: sequelize.literal('memberCount + 1') },
                { where: { id: groupId }, transaction: t }
            );
        }

        await t.commit();
        res.status(200).json({ success: created ? 'Member was created' : 'Member already exists' });

    } catch (err) {
        await t.rollback();
        console.error('Error Caught: ', err);
        res.status(500).json({ error: 'An error occurred while joining the member.' });
    }
}



// exports.sendMessage = async (req, res) => {
//     const { groupId } = req.params;
//     const { message } = req.body;
//     const userId = req.user.id; // Assuming req.user contains authenticated user info

//     if (!message && (!req.files || req.files.length === 0)) {
//         return res.status(400).json({ error: 'No message or files to send.' });
//     }

//     try {
//         // Create a new message
//         const newMessage = await Message.create({
//             groupId,
//             userId,
//             message,
//             // If files are included, handle file saving logic here
//         });

//         // Handle file uploads if there are any
//         if (req.files) {
//             req.files.forEach(file => {
//                 // Process each file as needed
//                 // You may want to save file info to the database or handle it differently
//                 // For example:
//                 // await File.create({ messageId: newMessage.id, filePath: file.path });
//             });
//         }

//         res.status(201).json(newMessage);
//     } catch (error) {
//         console.error('Error sending message:', error);
//         res.status(500).json({ error: 'An error occurred while sending the message.' });
//     }
// };



exports.sendMessage = async (req, res) => {
    const { groupId } = req.params;
    const { message } = req.body;
    const userId = req.user.id; // Assuming req.user contains authenticated user info

    if (!message && (!req.files || req.files.length === 0)) {
        return res.status(400).json({ error: 'No message or files to send.' });
    }

    const t = await sequelize.transaction();
    try {
        // Handle file uploads and store URLs
        let fileUrls = [];
        if (req.files) {
            req.files.forEach(file => {
                const fileUrl = `${req.protocol}://${req.get('host')}/uploads/images/${file.filename}`;
                fileUrls.push(fileUrl);
            });
        }

        // Create a new message
        const newMessage = await Message.create({
            groupId,
            userId,
            message,
            fileUrls: fileUrls.length > 0 ? fileUrls.join(',') : null,
        }, { transaction: t });

        await t.commit();
        res.status(201).json(newMessage);
    } catch (error) {
        await t.rollback();
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'An error occurred while sending the message.' });
    }
};


exports.getMessages = async (req, res) => {
    const { groupId } = req.params;

    try {
        const messages = await Message.findAll({
            where: { groupId }
        });

        // Transform the messages to include the file URLs as an array
        const transformedMessages = messages.map(msg => {
            return {
                id: msg.id,
                message: msg.message,
                fileUrls: msg.fileUrls ? msg.fileUrls.split(',') : [],
                userId: msg.userId,
                createdAt: msg.createdAt,
                updatedAt: msg.updatedAt
            };
        });

        res.status(200).json(transformedMessages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'An error occurred while fetching messages.' });
    }
};
