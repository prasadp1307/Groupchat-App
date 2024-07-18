const express = require('express');
const router = express.Router();
const auth = require('../middleware/authentication');
const chatController = require('../controllers/chatController');

router.post('/sendText', auth.authenticate, chatController.postTextMessage);
router.get('/messages', auth.authenticate, chatController.getMessages);

module.exports = router;
