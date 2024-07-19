document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.querySelector('#chat-messages');
    const messageInput = document.querySelector('#message-input');
    const sendButton = document.querySelector('#send-button');
    const token = localStorage.getItem('token');

    if (!token) {
        alert('User is not authenticated.');
        window.location.href = '/login.html'; // Redirect to login if no token found
        return;
    }

    console.log('Token:', token); // Log the token to ensure it is retrieved

    const username = 'You'; // Replace this with the actual username

    function addMessage(username, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<span class="username">${username}:</span> ${message}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            addMessage(username, message);
            messageInput.value = '';

            try {
                const sendMessageRes = await axios.post('http://localhost:4000/chat/sendText', {
                    message
                }, { headers: { Authorization: `Bearer ${token}` } });

                console.log('Message saved:', sendMessageRes.data);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        }
    }

    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    addMessage('System', `${username} joined the chat`);

    (async () => {
        try {
            const allTextMessages = await axios.get('http://localhost:4000/chat/getText', { headers: { Authorization: `Bearer ${token}` } });
            console.log('All messages:', allTextMessages.data); // Log the retrieved messages
            allTextMessages.data.forEach(msg => addMessage(msg.username, msg.message));
        } catch (err) {
            console.error('Error Caught: ', err);
        }
    })();
});
