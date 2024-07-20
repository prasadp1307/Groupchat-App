// document.addEventListener('DOMContentLoaded', () => {
//     const chatMessages = document.querySelector('#chat-messages');
//     const messageInput = document.querySelector('#message-input');
//     const sendButton = document.querySelector('#send-button');
//     const token = localStorage.getItem('token');
//     const username = localStorage.getItem('username'); // Retrieve username from localStorage

//     console.log('Token from localStorage:', token);
//     console.log('Username from localStorage:', username);

//     if (!token || !username) {
//         console.error('User is not authenticated or username is missing.');
//         alert('User is not authenticated.');
//         window.location.href = '/login.html'; // Redirect to login if no token or username found
//         return;
//     }

//     function addMessage(username, message, system = false) {
//         console.log('Adding message:', { username, message, system });
//         const messageElement = document.createElement('div');
//         messageElement.classList.add('message');
//         messageElement.classList.add(username === localStorage.getItem('username') ? 'sender' : 'receiver');
//         messageElement.innerHTML = system ? `<em>${message}</em>` : `<span class="username">${username}:</span> <span class="message-content">${message}</span>`;
//         chatMessages.appendChild(messageElement);
//         chatMessages.scrollTop = chatMessages.scrollHeight;
//     }

//     async function sendMessage() {
//         const message = messageInput.value.trim();
//         if (message) {
//             console.log('Sending message:', message);
//             addMessage(username, message);
//             messageInput.value = '';

//             try {
//                 const sendMessageRes = await axios.post('http://localhost:4000/chat/sendText', {
//                     message
//                 }, { headers: { Authorization: `Bearer ${token}` } });

//                 console.log('Message saved:', sendMessageRes.data);
//             } catch (error) {
//                 console.error('Error saving message:', error);
//             }
//         }
//     }

//     sendButton.addEventListener('click', sendMessage);

//     messageInput.addEventListener('keypress', (e) => {
//         if (e.key === 'Enter') {
//             sendMessage();
//         }
//     });

//     async function fetchMessages() {
//         try {
//             const allTextMessages = await axios.get('http://localhost:4000/chat/getText', { headers: { Authorization: `Bearer ${token}` } });
//             console.log('All messages:', allTextMessages.data);
//             chatMessages.innerHTML = ''; // Clear the chat window
//             allTextMessages.data.forEach(msg => {
//                 const messageUser = msg.user.name; // Extract the username from the API response
//                 addMessage(messageUser, msg.message);
//             });
//         } catch (err) {
//             console.error('Error fetching messages:', err);
//         }
//     }

//     // Fetch messages initially
//     fetchMessages();

//     // Fetch messages every second to make it real-time
//     setInterval(fetchMessages, 1000);

//     // Add a message indicating the user has joined the chat
//     addMessage('System', `${username} joined the chat`, true);
// });


document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.querySelector('#chat-messages');
    const messageInput = document.querySelector('#message-input');
    const sendButton = document.querySelector('#send-button');
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username'); // Retrieve username from localStorage

    console.log('Token from localStorage:', token);
    console.log('Username from localStorage:', username);

    if (!token || !username) {
        console.error('User is not authenticated or username is missing.');
        alert('User is not authenticated.');
        window.location.href = '/login.html'; // Redirect to login if no token or username found
        return;
    }

    function addMessage(username, message, system = false) {
        console.log('Adding message:', { username, message, system });
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(username === localStorage.getItem('username') ? 'sender' : 'receiver');
        messageElement.innerHTML = system ? `<em>${message}</em>` : `<span class="username">${username}:</span> <span class="message-content">${message}</span>`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function saveMessagesToLocal(messages) {
        localStorage.setItem('chats', JSON.stringify(messages.slice(-10))); // Save only the last 10 messages
    }

    function getMessagesFromLocal() {
        const messages = localStorage.getItem('chats');
        return messages ? JSON.parse(messages) : [];
    }

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            console.log('Sending message:', message);
            addMessage(username, message);
            messageInput.value = '';

            try {
                const sendMessageRes = await axios.post('http://localhost:4000/chat/sendText', {
                    message
                }, { headers: { Authorization: `Bearer ${token}` } });

                console.log('Message saved:', sendMessageRes.data);

                // Update local storage with the new message
                const messages = getMessagesFromLocal();
                messages.push({ username, message });
                saveMessagesToLocal(messages);
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

    async function fetchMessages() {
        try {
            const allTextMessages = await axios.get('http://localhost:4000/chat/getText', { headers: { Authorization: `Bearer ${token}` } });
            console.log('All messages:', allTextMessages.data);
            chatMessages.innerHTML = ''; // Clear the chat window
            allTextMessages.data.forEach(msg => {
                const messageUser = msg.user.name; // Extract the username from the API response
                addMessage(messageUser, msg.message);
            });

            // Save the most recent 10 messages to local storage
            const recentMessages = allTextMessages.data.slice(-10).map(msg => ({
                username: msg.user.name,
                message: msg.message
            }));
            saveMessagesToLocal(recentMessages);
        } catch (err) {
            console.error('Error fetching messages:', err);
        }
    }

    // Load messages from local storage
    const localMessages = getMessagesFromLocal();
    if (localMessages.length > 0) {
        console.log('Loading messages from local storage:', localMessages);
        localMessages.forEach(msg => addMessage(msg.username, msg.message));
    } else {
        // Fetch messages initially if no messages in local storage
        fetchMessages();
    }

    // Fetch messages every second to make it real-time
    setInterval(fetchMessages, 1000);

    // Add a message indicating the user has joined the chat
    addMessage('System', `${username} joined the chat`, true);
});
