document.addEventListener('DOMContentLoaded', async () => {
    // Retrieve token from localStorage
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

    // Add Group in Joined Section
    const addGroupInList = (groupObj) => {
        groupObj.forEach(obj => {
            joinedGroups.innerHTML += `<div class="group-name" id="${obj.id}"><p>${obj.name}</p></div>`;
        });
    };

    // Group details and message adder
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

    // Open Group
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

    // Create new group
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

    // Display joined groups and perform join operation if needed
    try {
        const getJoinedGroups = await axios.get(`http://localhost:4000/group/joinedGroups`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (getJoinedGroups.data.length !== 0) {
            addGroupInList(getJoinedGroups.data);
        }

        await joinFinish();
    } catch (err) {
        console.error('Error Caught: ', err.response ? err.response.data : err.message);
    }

    // Join operation
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

    function groupLinkCopy() {
        const copyText = document.getElementById("group-link").value;

        const tempTextarea = document.createElement("textarea");
        tempTextarea.value = copyText;
        document.body.appendChild(tempTextarea);

        tempTextarea.select();
        document.execCommand("copy");

        document.body.removeChild(tempTextarea);

        alert("Group Link Copied: " + copyText);
    }
});
