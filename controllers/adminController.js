const sequelize = require("../util/database");
const { Op } = require('sequelize');
const Message = require('../models/message');
const User = require('../models/users');
const Group = require("../models/group");
const Member = require("../models/member");

exports.getAllMembers = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        console.log('Fetching all members for group:', req.params.groupId);
        const groupMemers = await Member.findAll({
            include: [{
                model: User,
                as: 'user'
            }],
            where: {
                groupId: req.params.groupId
            }
        }, { transaction: t });

        await t.commit();
        res.status(200).json(groupMemers);
    } catch (err) {
        await t.rollback();
        console.error('Error Caught in getAllMembers:', err);
    }
};

exports.promoteMember = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        console.log('Promoting/Demoting member:', req.body.targetMember, 'in group:', req.body.groupId);
        const getMember = await Member.findOne({
            where: {
                id: req.body.targetMember,
                groupId: req.body.groupId
            },
            transaction: t
        });

        if (getMember.rank === 'Member') {
            console.log('Promoting member to Admin');
            getMember.rank = 'Admin';
        } else {
            console.log('Demoting member to Member');
            getMember.rank = 'Member';
        }
        await getMember.save({ transaction: t });

        await t.commit();
        res.status(200).json(getMember);
    } catch (err) {
        await t.rollback();
        console.error('Error Caught in promoteMember:', err);
    }
};

exports.removeMember = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        console.log('Removing member:', req.body.targetMember, 'from group:', req.body.groupId);
        const removeMember = await Member.destroy({
            where: {
                id: req.body.targetMember,
                groupId: req.body.groupId
            },
            transaction: t
        });

        await Group.update(
            { memberCount: sequelize.literal('memberCount - 1') },
            { where: { id: req.body.groupId }, transaction: t }
        );

        await t.commit();
        res.status(200).json(removeMember);
    } catch (err) {
        await t.rollback();
        console.error('Error Caught in removeMember:', err);
    }
};






exports.searchMember = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        // Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        console.log('Searching for member with criteria:', req.body);
        let where = {};

        // Extract search criteria
        if (req.body.searchTerm) {
            const searchTerm = req.body.searchTerm;
            if (isEmail(searchTerm)) {
                where.email = searchTerm;
            } else if (!isNaN(searchTerm)) {
                where.number = searchTerm;
            } else {
                where.name = searchTerm;
            }
        }

        const searchResult = await User.findOne({
            where
        }, { transaction: t });

        const result = { user: {} };

        if (searchResult) {
            console.log('User found:', searchResult);
            const checkIfAlreadyJoined = await searchResult.getMembers({
                where: {
                    groupId: req.body.groupId
                }
            }, { transaction: t });

            if (checkIfAlreadyJoined.length > 0) {
                console.log('User is already in the group');
                result.userfound = true;
                result.inGroup = true;
                result.id = checkIfAlreadyJoined[0].id;
                result.rank = checkIfAlreadyJoined[0].rank;
                result.user.name = searchResult.name;
            } else {
                console.log('User is not in the group');
                result.userfound = true;
                result.inGroup = false;
                result.user.id = searchResult.id;
                result.user.name = searchResult.name;
            }
        } else {
            console.log('User not found');
            result.userfound = false;
        }

        await t.commit();
        res.status(200).json(result);
    } catch (err) {
        await t.rollback();
        console.error('Error Caught in searchMember:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Helper function to check if a string is an email
function isEmail(str) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(str);
}
exports.addMember = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        console.log('Adding member:', req.body.userId, 'to group:', req.body.groupId);

        const [memberObj, created] = await Member.findOrCreate({
            where: {
                groupId: req.body.groupId,
                userId: req.body.userId
            },
            defaults: {
                rank: 'Member'
            },
            include: [{
                model: User,
                as: 'user'
            }],
            transaction: t
        });

        if (created) {
            console.log('Member successfully created');
            await Group.update(
                { memberCount: sequelize.literal('memberCount + 1') },
                { where: { id: req.body.groupId }, transaction: t }
            );
        } else {
            console.log('Member already exists');
        }

        await t.commit();
        res.status(200).json(memberObj);
    } catch (err) {
        if (!t.finished) { // Check if the transaction is still active
            await t.rollback();
        }
        console.error('Error Caught in addMember:', err);
        res.status(500).json({ message: 'An error occurred while adding the member.' });
    }
};

