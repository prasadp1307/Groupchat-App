document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.querySelector('#chat-messages');
    const messageInput = document.querySelector('#message-input');
    const sendButton = document.querySelector('#send-button');
    
    // Mock username for demonstration
    const username = 'You'; // Replace this with the actual username

    // Function to add a message to the chat
    function addMessage(username, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<span class="username">${username}:</span> ${message}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to handle sending a message
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            addMessage(username, message);
            messageInput.value = '';
            // Emit the message to the server (assuming you have a server setup)
            socket.emit('chatMessage', { username, message });
        }
    }

    // Event listener for the send button
    sendButton.addEventListener('click', sendMessage);

    // Event listener for pressing the Enter key in the message input
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add a message indicating the user has joined the chat
    addMessage('System', `${username} joined the chat`);

    // Socket event listener for receiving a message (assuming you have a server setup)
    socket.on('chatMessage', ({ username, message }) => {
        addMessage(username, message);
    });

    // Initialize socket connection
    const socket = io();

    // Notify the server that a new user has joined
    socket.emit('userJoined', username);

    // Event listener for user joined notification
    socket.on('userJoined', (username) => {
        addMessage('System', `${username} joined the chat`);
    });

    // Event listener for user left notification
    socket.on('userLeft', (username) => {
        addMessage('System', `${username} left the chat`);
    });
});
