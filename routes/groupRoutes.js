const express = require('express');
const router = express.Router();
const auth = require('../middleware/authentication');
const upload = require('../middleware/upload'); 
const groupController = require('../controllers/groupController');

router.post('/createGroup', auth.authenticate, groupController.createGroup);
router.get('/joinedGroups', auth.authenticate, groupController.joinedGroup);
router.get('/openGroup/:id', auth.authenticate, groupController.openGroup);
router.get('/groupDetails/:inviteId', auth.authenticate, groupController.groupDetails);
router.get('/joinMember/:groupId', auth.authenticate, groupController.joinMember);
router.post('/sendMessage/:groupId', auth.authenticate, upload.array('uploadFile'), groupController.sendMessage);
router.get('/messages/:groupId', auth.authenticate, groupController.getMessages);

module.exports = router;
