document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('Token is not available.');
        return;
    }

    const createBtn = document.querySelector('#create-group-button');
    const joinedGroups = document.querySelector('.joinedGroups');
    const groupchatForm = document.querySelector('.chatForm');
    const newGroup = document.querySelector('.newGroup');
    const showMessage = document.querySelector('.showMessage');
    const sendBtn = document.querySelector('#sendBtn');
    const messageInput = document.querySelector('#message');
    const File = document.querySelector('#uploadFile');

    const addGroupInList = (groupObj) => {
        joinedGroups.innerHTML = ''; // Clear the list before adding new groups
        groupObj.forEach(obj => {
            joinedGroups.innerHTML += `<div class="group-name" id="${obj.id}"><p>${obj.name}</p></div>`;
        });
    };

    const groupManager = (groupObj) => {
        const groupName = document.querySelector('.groupName');
        const groupMembersCount = document.querySelector('.groupMembersCount');
        const groupLink = document.querySelector('.groupLink');

        groupName.innerHTML = `<h3>${groupObj.groupDetails.name}</h3>`;
        groupMembersCount.innerHTML = `<p>Members: ${groupObj.groupDetails.memberCount}</p>`;
        groupLink.innerHTML = `
            <input type="hidden" value="http://localhost:4000/group/join/${groupObj.groupDetails.inviteLink}" id="group-link">
            <button class="linkClipboard" onclick="groupLinkCopy()">📋</button>`;

        localStorage.setItem('groupId', `${groupObj.groupDetails.id}`);

        showMessage.innerHTML = '';
        getmsgs();

        groupchatForm.style.display = 'flex';
    };

    const memberToMessageOpen = () => {
        const members = document.querySelector('.members');
        const showMessage = document.querySelector('.showMessage');
        members.style.display = 'block';
        showMessage.style.display = 'block';
        console.log('memberToMessageOpen called');
    };

    joinedGroups.addEventListener('click', async (e) => {
        if (e.target.classList.contains('group-name') || e.target.parentElement.classList.contains('group-name')) {
            try {
                const groupId = e.target.id || e.target.parentElement.id;
                const groupData = await axios.get(`http://localhost:4000/group/openGroup/${groupId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const activeGroupId = +localStorage.getItem('groupId');
                if (!isNaN(activeGroupId)) {
                    const lastClickedGroup = document.querySelector(`.joinedGroups [id='${activeGroupId}']`);
                    if (lastClickedGroup) {
                        lastClickedGroup.style.backgroundColor = 'white';
                    }
                }

                const nowClickedGroup = document.querySelector(`.joinedGroups [id='${groupId}']`);
                nowClickedGroup.style.backgroundColor = 'yellowgreen';

                groupManager(groupData.data);

                memberToMessageOpen();
            } catch (err) {
                console.error('Error Caught: ', err.response ? err.response.data : err.message);
            }
        }
    });

    if (createBtn) {
        createBtn.addEventListener('click', async (e) => {
            try {
                document.querySelector('.groupName').innerHTML = '';
                document.querySelector('.groupMembersCount').innerHTML = '';
                document.querySelector('.groupLink').innerHTML = '';
                document.querySelector('.newGroup').innerHTML = '';
                newGroup.innerHTML = `
                <div>
                    <form class="createForm">
                        <label for="groupName">Group Name:</label>
                        <input type="text" name="groupName" id="groupName" required>
                        <input type="submit" value="Create Group" id="sendBtn">
                    </form>
                    <button class="cancelBtn">Cancel</button>
                </div>`;

                const cancelBtn = document.querySelector('.cancelBtn');
                const createForm = document.querySelector('.createForm');
                const groupName = document.querySelector('#groupName');

                if (cancelBtn) {
                    cancelBtn.addEventListener('click', (e) => {
                        newGroup.innerHTML = '';
                    });
                }

                if (createForm) {
                    createForm.addEventListener('submit', async (e) => {
                        try {
                            e.preventDefault();
                            const groupData = await axios.post(`http://localhost:4000/group/createGroup`, {
                                groupName: groupName.value
                            }, { headers: { Authorization: `Bearer ${token}` } });
                            addGroupInList([groupData.data]);
                        } catch (err) {
                            console.error('Error Caught: ', err.response ? err.response.data : err.message);
                        }
                    });
                }

            } catch (err) {
                console.error('Error Caught: ', err.response ? err.response.data : err.message);
            }
        });
    } else {
        console.error('Create button not found.');
    }

    // This code block should not be within another DOMContentLoaded listener



    try {
        const getJoinedGroups = await axios.get(`http://localhost:4000/group/joinedGroups`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Joined Groups Data: ', getJoinedGroups.data);

        if (getJoinedGroups.data.length !== 0) {
            addGroupInList(getJoinedGroups.data);
        }

        joinFinish();
    } catch (err) {
        console.error('Error Caught: ', err.response ? err.response.data : err.message);
    }

    
    async function joinFinish() {
        try {
            if (localStorage.getItem('joinOp') === 'true') {
                const groupId = localStorage.getItem('groupId');
                const groupData = await axios.get(`http://localhost:4000/group/openGroup/${groupId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const activeGroupId = +localStorage.getItem('groupId');
                if (!isNaN(activeGroupId)) {
                    const lastClickedGroup = document.querySelector(`.joinedGroups [id='${activeGroupId}']`);
                    if (lastClickedGroup) {
                        lastClickedGroup.style.backgroundColor = 'white';
                    }
                }

                const nowClickedGroup = document.querySelector(`.joinedGroups [id='${groupId}']`);
                nowClickedGroup.style.backgroundColor = 'yellowgreen';

                groupManager(groupData.data);

                showMessage.style.display = 'block';
                localStorage.removeItem('joinOp');
            }
        } catch (err) {
            console.error('Error Caught: ', err.response ? err.response.data : err.message);
        }
    }




    async function getmsgs() {
        const groupId = localStorage.getItem('groupId');
        try {
            const msgs = await axios.get(`http://localhost:4000/group/messages/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (msgs.data && msgs.data.length) {
                msgs.data.forEach(msg => {
                    showMessage.innerHTML += `<div class="message"><p>${msg.message}</p></div>`;
                });
            }
        } catch (err) {
            console.error('Error Caught: ', err.response ? err.response.data : err.message);
        }
    }

    groupchatForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const groupId = localStorage.getItem('groupId');
        const message = messageInput.value;
        const files = uploadFile.files;

        if (!message && files.length === 0) {
            console.error('No message or files to send.');
            return;
        }

        const formData = new FormData();
        formData.append('message', message);
        for (let file of files) {
            formData.append('uploadFile', file);
        }

        try {
            await axios.post(`http://localhost:4000/group/sendMessage/${groupId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Clear input fields after sending the message
            messageInput.value = '';
            uploadFile.value = '';

            // Fetch and display updated messages
            showMessage.innerHTML = '';
            getmsgs();
        } catch (err) {
            console.error('Error Caught: ', err.response ? err.response.data : err.message);
        }
    });
});


