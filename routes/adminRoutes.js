const express = require('express');

const router = express.Router();

const auth = require('../middleware/authentication');

const adminController = require('../controllers/adminController');

router.get('/membersDetails/:groupId', auth.authenticate , adminController.getAllMembers);
router.post('/promoteDemote', auth.authenticate , adminController.promoteMember);
router.post('/removeMember', auth.authenticate , adminController.removeMember);
router.post('/searchMember', auth.authenticate , adminController.searchMember);
router.post('/addMember', auth.authenticate , adminController.addMember);

module.exports = router;