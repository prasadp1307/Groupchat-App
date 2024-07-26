const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const upload = require('../middleware/upload'); // Import the upload middleware

// Route to send message with file upload
router.post('/sendMessage/:groupId', upload.array('files'), chatController.sendMessage);

// Route to get messages
router.get('/getMessages/:groupId', chatController.getMessages);

module.exports = router;
