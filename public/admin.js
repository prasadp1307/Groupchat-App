// // document.addEventListener('DOMContentLoaded', () => {
// //     const memberSearch = document.querySelector('.memberSearch');
// //     const newGroup = document.querySelector('.newGroup');
// //     const memberSearchResult = document.querySelector('.memberSearchResult');
// //     const showMessage = document.querySelector('.showMessage');
// //     const memberSection = document.querySelector('.memberSection'); // Adjust selector as needed

// //     const findMember = document.querySelector('#findMember');
// //     const groupMembersCount = document.querySelector('.groupMembersCount'); // Ensure this element exists
// //     const token = localStorage.getItem('token');
// //     const groupId = localStorage.getItem('groupId');
// //     const groupchatForm = document.querySelector('.chatForm.groupForm');
// //     const closeMember = document.querySelector('.closeMember');

// //     // Handle search submission
// //     memberSearch.addEventListener('submit', async (e) => {
// //         e.preventDefault();
// //         const searchValue = findMember.value.trim();

// //         try {
// //             const response = await axios.post('http://localhost:4000/admin/searchMember', {
// //                 searchTerm: searchValue,
// //                 groupId: groupId
// //             }, { headers: { Authorization: `Bearer ${token}` } });

// //             const users = response.data;

// //             memberSearchResult.innerHTML = '';
// //             if (users.userfound) {
// //                 memberSearchResult.innerHTML = `
// //                     <div class="user${users.user.id}">
// //                         <span class="userName">${users.user.name}</span>
// //                         <button class="addMember" id="${users.user.id}">Add Member</button>
// //                     </div>
// //                 `;
// //             } else {
// //                 memberSearchResult.innerHTML = `
// //                     <div>
// //                         <span>No users found.</span>
// //                     </div>
// //                 `;
// //             }
// //         } catch (err) {
// //             console.error('Error fetching users:', err);
// //             memberSearchResult.innerHTML = `
// //                 <div>
// //                     <span>An error occurred. Please try again.</span>
// //                 </div>
// //             `;
// //         }
// //     });

// //     // Handle adding a member to the group
// //     memberSearchResult.addEventListener('click', async (e) => {
// //         if (e.target.classList.contains('addMember')) {
// //             const userId = e.target.id;
// //             try {
// //                 await axios.post('http://localhost:4000/admin/addMember', {
// //                     userId: userId,
// //                     groupId: groupId
// //                 }, { headers: { Authorization: `Bearer ${token}` } });

// //                 alert('User added successfully!');
// //                 groupMembersCount.click(); // Refresh the group members list
// //             } catch (err) {
// //                 console.error('Error adding member:', err);
// //             }
// //         }
// //     });

// //     // Define functions for toggling views
// //     function memberToMessageOpen() {
// //         newGroup.innerHTML = '';
// //         findMember.value = '';
// //         memberSearchResult.innerHTML = '';
// //         closeMember.style.display = 'none';
// //         memberSearch.style.display = 'none';
// //         showMessage.style.display = 'block';
// //         groupchatForm.style.display = 'flex';
// //     }

// //     function messageToMemberOpen() {
// //         newGroup.innerHTML = '';
// //         findMember.value = '';
// //         memberSearchResult.innerHTML = '';
// //         showMessage.style.display = 'none';
// //         groupchatForm.style.display = 'none';
// //         closeMember.style.display = 'block';
// //         memberSearch.style.display = 'block';
// //     }

// //     function createBtnTap() {
// //         newGroup.innerHTML = '';
// //         findMember.value = '';
// //         memberSearchResult.innerHTML = '';
// //         groupchatForm.style.display = 'none';
// //         showMessage.style.display = 'none';
// //         closeMember.style.display = 'none';
// //         memberSearch.style.display = 'none';
// //     }

// //     const memberPrint = (member, isAdmin, isOwner) => {
// //         let memberHTML = `
// //             <div class="member${member.id}">
// //                 <span class="memberName" id="${member.id}">${member.user.name}</span>
// //                 <span class="memberRank" id="${member.id}">${member.rank}</span>
// //             </div>
// //         `;

// //         if (isAdmin || isOwner) {
// //             if (member.rank === 'Member') {
// //                 memberHTML += `
// //                     <div class="member${member.id}">
// //                         <button class="promote" id="${member.id}">Promote</button>
// //                         <button class="remove" id="${member.id}">Remove</button>
// //                     </div>
// //                 `;
// //             } else if (member.rank === 'Admin') {
// //                 memberHTML += `
// //                     <div class="member${member.id}">
// //                         <button class="demote" id="${member.id}">Demote</button>
// //                         <button class="remove" id="${member.id}">Remove</button>
// //                     </div>
// //                 `;
// //             }
// //         }

// //         return memberHTML;
// //     }

// //     const memberList = (members) => {
// //         messageToMemberOpen();
// //         const userID = parseJwt(token).userID;

// //         function findRank(members, userID) {
// //             for (let member of members) {
// //                 if (member.userId === userID) {
// //                     return member.rank;
// //                 }
// //             }
// //         }

// //         const myRank = findRank(members, userID);
// //         myRankInActiveGroup = myRank;

// //         const isAdmin = myRank === 'Admin';
// //         const isOwner = myRank === 'Owner';

// //         members.forEach(member => {
// //             const memberHTML = memberPrint(member, isAdmin, isOwner);
// //             if (member.rank === 'Member') {
// //                 memberDiv.innerHTML += memberHTML;
// //             } else if (member.rank === 'Admin') {
// //                 adminDiv.innerHTML += memberHTML;
// //             } else {
// //                 ownerDiv.innerHTML += memberHTML;
// //             }
// //         });
// //     };

// //     // Handle group members count click
// //     groupMembersCount.addEventListener('click', async (e) => {
// //         const groupId = localStorage.getItem('groupId');
// //         try {
// //             const allMembers = await axios.get(`http://localhost:4000/admin/membersDetails/${groupId}`, { headers: { Authorization: `Bearer ${token}` } });
// //             memberList(allMembers.data);
// //         } catch (err) {
// //             console.error('Error Caught: ', err);
// //         }
// //     });

// //     // Handle member promotion/demotion and removal
// //     memberSection.addEventListener('click', async (e) => {
// //         const groupId = +localStorage.getItem('groupId');
// //         try {
// //             if (e.target.classList.contains('promote') || e.target.classList.contains('demote')) {
// //                 const promoteMember = await axios.post(`http://localhost:4000/admin/promoteDemote`, {
// //                     groupId: groupId,
// //                     targetMember: e.target.id
// //                 }, { headers: { Authorization: `Bearer ${token}` } });

// //                 const rankSpan = document.querySelector(`.memberRank[id='${e.target.id}']`);
// //                 if (promoteMember.data.rank === 'Admin') {
// //                     rankSpan.innerHTML = 'Admin';
// //                     e.target.classList = 'demote';
// //                     e.target.innerHTML = 'Demote';
// //                 } else {
// //                     rankSpan.innerHTML = 'Member';
// //                     e.target.classList = 'promote';
// //                     e.target.innerHTML = 'Promote';
// //                 }
// //             } else if (e.target.classList.contains('remove')) {
// //                 const removeMember = await axios.post(`http://localhost:4000/admin/removeMember`, {
// //                     groupId: groupId,
// //                     targetMember: e.target.id
// //                 }, { headers: { Authorization: `Bearer ${token}` } });

// //                 const membersCountElement = document.querySelector('.groupMembersCount p');
// //                 let currentCount = parseInt(membersCountElement.textContent.split(': ')[1]);
// //                 let newCount = currentCount - 1;
// //                 membersCountElement.textContent = `Members: ${newCount}`;

// //                 const rmUserDivs = document.querySelectorAll(`.member${e.target.id}`);
// //                 rmUserDivs.forEach(div => div.remove());
// //             }
// //         } catch (err) {
// //             console.error('Error Caught: ', err);
// //         }
// //     });
// // });




// // document.addEventListener('DOMContentLoaded', () => {
// //     const memberSearch = document.querySelector('.memberSearch');
// //     const newGroup = document.querySelector('.newGroup');
// //     const memberSearchResult = document.querySelector('.memberSearchResult');
// //     const showMessage = document.querySelector('.showMessage');
// //     const findMember = document.querySelector('#findMember');
// //     const groupMembersCount = document.querySelector('.groupMembersCount');
// //     const token = localStorage.getItem('token');
// //     const groupId = localStorage.getItem('groupId');
// //     const groupchatForm = document.querySelector('.chatForm.groupForm');
// //     const closeMember = document.querySelector('.closeMember');
// //     const ownerDiv = document.querySelector('.owner-div');
// //     const memberSection = document.querySelector('.memberSection');

// //     // Define parseJwt function
// //     function parseJwt(token) {
// //         try {
// //             const base64Url = token.split('.')[1];
// //             const base64 = decodeURIComponent(atob(base64Url).split('').map(c =>
// //                 '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
// //             ).join(''));
// //             return JSON.parse(base64);
// //         } catch (error) {
// //             console.error('Error parsing JWT:', error);
// //             return null;
// //         }
// //     }

// //     // Handle search submission
// //     if (memberSearch) {
// //         memberSearch.addEventListener('submit', async (e) => {
// //             e.preventDefault();
// //             const searchValue = findMember.value.trim();

// //             try {
// //                 const response = await axios.post('http://localhost:4000/admin/searchMember', {
// //                     searchTerm: searchValue,
// //                     groupId: groupId
// //                 }, { headers: { Authorization: `Bearer ${token}` } });

// //                 const users = response.data;

// //                 memberSearchResult.innerHTML = '';
// //                 if (users.userfound) {
// //                     memberSearchResult.innerHTML = `
// //                         <div class="user${users.user.id}">
// //                             <span class="userName">${users.user.name}</span>
// //                             <button class="addMember" id="${users.user.id}">Add Member</button>
// //                         </div>
// //                     `;
// //                 } else {
// //                     memberSearchResult.innerHTML = `
// //                         <div>
// //                             <span>No users found.</span>
// //                         </div>
// //                     `;
// //                 }
// //             } catch (err) {
// //                 console.error('Error fetching users:', err);
// //                 memberSearchResult.innerHTML = `
// //                     <div>
// //                         <span>An error occurred. Please try again.</span>
// //                     </div>
// //                 `;
// //             }
// //         });
// //     }

// //     // Handle adding a member to the group
// //     if (memberSearchResult) {
// //         memberSearchResult.addEventListener('click', async (e) => {
// //             if (e.target.classList.contains('addMember')) {
// //                 const userId = e.target.id;
// //                 try {
// //                     await axios.post('http://localhost:4000/admin/addMember', {
// //                         userId: userId,
// //                         groupId: groupId
// //                     }, { headers: { Authorization: `Bearer ${token}` } });

// //                     alert('User added successfully!');
// //                     if (groupMembersCount) groupMembersCount.click(); // Refresh the group members list
// //                 } catch (err) {
// //                     console.error('Error adding member:', err);
// //                 }
// //             }
// //         });
// //     }

// //     // Define functions for toggling views
// //     function memberToMessageOpen() {
// //         if (newGroup) newGroup.innerHTML = '';
// //         if (findMember) findMember.value = '';
// //         if (memberSearchResult) memberSearchResult.innerHTML = '';
// //         if (closeMember) closeMember.style.display = 'none';
// //         if (memberSearch) memberSearch.style.display = 'none';
// //         if (showMessage) showMessage.style.display = 'block';
// //         if (groupchatForm) groupchatForm.style.display = 'flex';
// //     }

// //     function messageToMemberOpen() {
// //         if (newGroup) newGroup.innerHTML = '';
// //         if (findMember) findMember.value = '';
// //         if (memberSearchResult) memberSearchResult.innerHTML = '';
// //         if (showMessage) showMessage.style.display = 'none';
// //         if (groupchatForm) groupchatForm.style.display = 'none';
// //         if (closeMember) closeMember.style.display = 'block';
// //         if (memberSearch) memberSearch.style.display = 'block';
// //     }

// //     function createBtnTap() {
// //         if (newGroup) newGroup.innerHTML = '';
// //         if (findMember) findMember.value = '';
// //         if (memberSearchResult) memberSearchResult.innerHTML = '';
// //         if (groupchatForm) groupchatForm.style.display = 'none';
// //         if (showMessage) showMessage.style.display = 'none';
// //         if (closeMember) closeMember.style.display = 'none';
// //         if (memberSearch) memberSearch.style.display = 'none';
// //     }

// //     const memberPrint = (member, isAdmin, isOwner) => {
// //         let memberHTML = `
// //             <div class="member${member.id}">
// //                 <span class="memberName" id="${member.id}">${member.user.name}</span>
// //                 <span class="memberRank" id="${member.id}">${member.rank}</span>
// //             </div>
// //         `;

// //         if (isAdmin || isOwner) {
// //             if (member.rank === 'Member') {
// //                 memberHTML += `
// //                     <div class="member${member.id}">
// //                         <button class="promote" id="${member.id}">Promote</button>
// //                         <button class="remove" id="${member.id}">Remove</button>
// //                     </div>
// //                 `;
// //             } else if (member.rank === 'Admin') {
// //                 memberHTML += `
// //                     <div class="member${member.id}">
// //                         <button class="demote" id="${member.id}">Demote</button>
// //                         <button class="remove" id="${member.id}">Remove</button>
// //                     </div>
// //                 `;
// //             }
// //         }

// //         return memberHTML;
// //     }

// //     const memberList = (members) => {
// //         messageToMemberOpen();
// //         const userID = parseJwt(token).userID;

// //         function findRank(members, userID) {
// //             for (let member of members) {
// //                 if (member.userId === userID) {
// //                     return member.rank;
// //                 }
// //             }
// //         }

// //         const myRank = findRank(members, userID);
// //         myRankInActiveGroup = myRank;

// //         const isAdmin = myRank === 'Admin';
// //         const isOwner = myRank === 'Owner';

// //         members.forEach(member => {
// //             const memberHTML = memberPrint(member, isAdmin, isOwner);
// //             if (member.rank === 'Member') {
// //                 memberDiv.innerHTML += memberHTML;
// //             } else if (member.rank === 'Admin') {
// //                 adminDiv.innerHTML += memberHTML;
// //             } else {
// //                 ownerDiv.innerHTML += memberHTML;
// //             }
// //         });
// //     };

// //     // Handle group members count click
// //     if (groupMembersCount) {
// //         groupMembersCount.addEventListener('click', async (e) => {
// //             try {
// //                 const allMembers = await axios.get(`http://localhost:4000/admin/membersDetails/${groupId}`, { headers: { Authorization: `Bearer ${token}` } });
// //                 memberList(allMembers.data);
// //             } catch (err) {
// //                 console.error('Error Caught: ', err);
// //             }
// //         });
// //     }

// //     // Handle member promotion/demotion and removal
// //     if (memberSection) {
// //         memberSection.addEventListener('click', async (e) => {
// //             try {
// //                 if (e.target.classList.contains('promote') || e.target.classList.contains('demote')) {
// //                     const promoteMember = await axios.post(`http://localhost:4000/admin/promoteDemote`, {
// //                         groupId: groupId,
// //                         targetMember: e.target.id
// //                     }, { headers: { Authorization: `Bearer ${token}` } });

// //                     const rankSpan = document.querySelector(`.memberRank[id='${e.target.id}']`);
// //                     if (rankSpan) {
// //                         if (promoteMember.data.rank === 'Admin') {
// //                             rankSpan.innerHTML = 'Admin';
// //                             e.target.classList = 'demote';
// //                             e.target.innerHTML = 'Demote';
// //                         } else {
// //                             rankSpan.innerHTML = 'Member';
// //                             e.target.classList = 'promote';
// //                             e.target.innerHTML = 'Promote';
// //                         }
// //                     }
// //                 } else if (e.target.classList.contains('remove')) {
// //                     const removeMember = await axios.post(`http://localhost:4000/admin/removeMember`, {
// //                         groupId: groupId,
// //                         targetMember: e.target.id
// //                     }, { headers: { Authorization: `Bearer ${token}` } });

// //                     const membersCountElement = document.querySelector('.groupMembersCount p');
// //                     if (membersCountElement) {
// //                         let currentCount = parseInt(membersCountElement.textContent.split(': ')[1]);
// //                         let newCount = currentCount - 1;
// //                         membersCountElement.textContent = `Members: ${newCount}`;
// //                     }

// //                     const rmUserDivs = document.querySelectorAll(`.member${e.target.id}`);
// //                     rmUserDivs.forEach(div => div.remove());
// //                 }
// //             } catch (err) {
// //                 console.error('Error Caught: ', err);
// //             }
// //         });
// //     }
// // });



// document.addEventListener('DOMContentLoaded', () => {
//     const memberSearch = document.querySelector('.memberSearch');
//     const newGroup = document.querySelector('.newGroup');
//     const memberSearchResult = document.querySelector('.memberSearchResult');
//     const showMessage = document.querySelector('.showMessage');
//     const findMember = document.querySelector('#findMember');
//     const groupMembersCount = document.querySelector('.groupMembersCount');
//     const ownerDiv = document.querySelector('.owner-div');
//     const adminDiv = document.querySelector('.admin-div'); // Added this line to define adminDiv
//     const memberDiv = document.querySelector('.member-div'); // Added this line to define memberDiv
//     const token = localStorage.getItem('token');
//     const groupId = localStorage.getItem('groupId');
//     const groupchatForm = document.querySelector('.chatForm.groupForm');
//     const closeMember = document.querySelector('.closeMember');
//     const memberSection = document.querySelector('.memberSection');


    
//     let myRankInActiveGroup = null;

//     // Define parseJwt function
//     function parseJwt(token) {
//         try {
//             const base64Url = token.split('.')[1];
//             const base64 = decodeURIComponent(atob(base64Url).split('').map(c =>
//                 '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
//             ).join(''));
//             return JSON.parse(base64);
//         } catch (error) {
//             console.error('Error parsing JWT:', error);
//             return null;
//         }
//     }

//     // Handle search submission
//     if (memberSearch) {
//         memberSearch.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             const searchValue = findMember.value.trim();

//             try {
//                 const response = await axios.post('http://localhost:4000/admin/searchMember', {
//                     searchTerm: searchValue,
//                     groupId: groupId
//                 }, { headers: { Authorization: `Bearer ${token}` } });

//                 const users = response.data;

//                 memberSearchResult.innerHTML = '';
//                 if (users.userfound) {
//                     memberSearchResult.innerHTML = `
//                         <div class="user${users.user.id}">
//                             <span class="userName">${users.user.name}</span>
//                             <button class="addMember" id="${users.user.id}">Add Member</button>
//                         </div>
//                     `;
//                 } else {
//                     memberSearchResult.innerHTML = `
//                         <div>
//                             <span>No users found.</span>
//                         </div>
//                     `;
//                 }
//             } catch (err) {
//                 console.error('Error fetching users:', err);
//                 memberSearchResult.innerHTML = `
//                     <div>
//                         <span>An error occurred. Please try again.</span>
//                     </div>
//                 `;
//             }
//         });
//     }

//     // Handle adding a member to the group
//     if (memberSearchResult) {
//         memberSearchResult.addEventListener('click', async (e) => {
//             if (e.target.classList.contains('addMember')) {
//                 const userId = e.target.id;
//                 try {
//                     await axios.post('http://localhost:4000/admin/addMember', {
//                         userId: userId,
//                         groupId: groupId
//                     }, { headers: { Authorization: `Bearer ${token}` } });

//                     alert('User added successfully!');
//                     if (groupMembersCount) groupMembersCount.click(); // Refresh the group members list
//                 } catch (err) {
//                     console.error('Error adding member:', err);
//                 }
//             }
//         });
//     }

//     const memberPrint = (member, isAdmin, isOwner) => {
//         let memberHTML = `
//             <div class="member${member.id}">
//                 <span class="memberName" id="${member.id}">${member.user.name}</span>
//                 <span class="memberRank" id="${member.id}">${member.rank}</span>
//             </div>
//         `;

//         if (isAdmin || isOwner) {
//             if (member.rank === 'Member') {
//                 memberHTML += `
//                     <div class="member${member.id}">
//                         <button class="promote" id="${member.id}">Promote</button>
//                         <button class="remove" id="${member.id}">Remove</button>
//                     </div>
//                 `;
//             } else if (member.rank === 'Admin') {
//                 memberHTML += `
//                     <div class="member${member.id}">
//                         <button class="demote" id="${member.id}">Demote</button>
//                         <button class="remove" id="${member.id}">Remove</button>
//                     </div>
//                 `;
//             }
//         }

//         return memberHTML;
//     };

//     function messageToMemberOpen() {
//         if (newGroup) newGroup.innerHTML = '';
//         if (findMember) findMember.value = '';
//         if (memberSearchResult) memberSearchResult.innerHTML = '';
//         if (groupchatForm) groupchatForm.style.display = 'none';
//         if (showMessage) showMessage.style.display = 'none';
//         if (closeMember) closeMember.style.display = 'block';
//         if (memberSearch) memberSearch.style.display = 'block';
//         if (ownerDiv) ownerDiv.innerHTML = '';
//         if (adminDiv) adminDiv.innerHTML = '';
//         if (memberDiv) memberDiv.innerHTML = '';
//     }
    
        
//     const memberList = (members) => {
//         messageToMemberOpen();
//         const userID = parseJwt(token).userID;

//         function findRank(members, userID) {
//             for (let member of members) {
//                 if (member.userId === userID) {
//                     return member.rank;
//                 }
//             }
//         }

//         const myRank = findRank(members, userID);
//         myRankInActiveGroup = myRank;

//         const isAdmin = myRank === 'Admin';
//         const isOwner = myRank === 'Owner';

//         members.forEach(member => {
//             const memberHTML = memberPrint(member, isAdmin, isOwner);
//             if (member.rank === 'Member' && memberDiv) {
//                 memberDiv.innerHTML += memberHTML;
//             } else if (member.rank === 'Admin' && adminDiv) {
//                 adminDiv.innerHTML += memberHTML;
//             } else if (ownerDiv) {
//                 ownerDiv.innerHTML += memberHTML;
//             }
//         });
//     };

//     // Handle group members count click
//     if (groupMembersCount) {
//         groupMembersCount.addEventListener('click', async (e) => {
//             try {
//                 const allMembers = await axios.get(`http://localhost:4000/admin/membersDetails/${groupId}`, { headers: { Authorization: `Bearer ${token}` } });
//                 memberList(allMembers.data);
//             } catch (err) {
//                 console.error('Error Caught: ', err);
//             }
//         });
//     }


    
//     // Handle member promotion/demotion and removal
//     if (memberSection) {
//         memberSection.addEventListener('click', async (e) => {
//             try {
//                 if (e.target.classList.contains('promote') || e.target.classList.contains('demote')) {
//                     const promoteMember = await axios.post(`http://localhost:4000/admin/promoteDemote`, {
//                         groupId: groupId,
//                         targetMember: e.target.id
//                     }, { headers: { Authorization: `Bearer ${token}` } });

//                     const rankSpan = document.querySelector(`.memberRank[id='${e.target.id}']`);
//                     if (rankSpan) {
//                         if (promoteMember.data.rank === 'Admin') {
//                             rankSpan.innerHTML = 'Admin';
//                             e.target.classList = 'demote';
//                             e.target.innerHTML = 'Demote';
//                         } else {
//                             rankSpan.innerHTML = 'Member';
//                             e.target.classList = 'promote';
//                             e.target.innerHTML = 'Promote';
//                         }
//                     }
//                 } else if (e.target.classList.contains('remove')) {
//                     const removeMember = await axios.post(`http://localhost:4000/admin/removeMember`, {
//                         groupId: groupId,
//                         targetMember: e.target.id
//                     }, { headers: { Authorization: `Bearer ${token}` } });

//                     const membersCountElement = document.querySelector('.groupMembersCount p');
//                     if (membersCountElement) {
//                         let currentCount = parseInt(membersCountElement.textContent.split(': ')[1]);
//                         let newCount = currentCount - 1;
//                         membersCountElement.textContent = `Members: ${newCount}`;
//                     }

//                     const rmUserDivs = document.querySelectorAll(`.member${e.target.id}`);
//                     rmUserDivs.forEach(div => div.remove());
//                 }
//             } catch (err) {
//                 console.error('Error Caught: ', err);
//             }
//         });
//     }
// });



        document.addEventListener('DOMContentLoaded', () => {
            const memberSearch = document.querySelector('.memberSearch');
            const newGroup = document.querySelector('.newGroup');
            const memberSearchResult = document.querySelector('.memberSearchResult');
            const showMessage = document.querySelector('.showMessage');
            const findMember = document.querySelector('#findMember');
            const groupMembersCount = document.querySelector('.groupMembersCount');
            const ownerDiv = document.querySelector('.owner-div');
            const adminDiv = document.querySelector('.admin-div'); 
            const memberDiv = document.querySelector('.member-div'); 
            const token = localStorage.getItem('token');
            const groupId = localStorage.getItem('groupId');
            const groupchatForm = document.querySelector('.chatForm.groupForm');
            const closeMember = document.querySelector('.closeMember');
            const memberSection = document.querySelector('.memberSection');

            let myRankInActiveGroup = null;

            function memberToMessageOpen() {
                if (newGroup) newGroup.innerHTML = '';
                if (findMember) findMember.value = '';
                if (memberSearchResult) memberSearchResult.innerHTML = '';
                if (closeMember) closeMember.style.display = 'none';
                if (memberSearch) memberSearch.style.display = 'none';
                if (showMessage) showMessage.style.display = 'block';
                if (groupchatForm) groupchatForm.style.display = 'flex';
            }

            function messageToMemberOpen() {
                if (newGroup) newGroup.innerHTML = '';
                if (findMember) findMember.value = '';
                if (memberSearchResult) memberSearchResult.innerHTML = '';
                if (groupchatForm) groupchatForm.style.display = 'none';
                if (showMessage) showMessage.style.display = 'none';
                if (closeMember) closeMember.style.display = 'block';
                if (memberSearch) memberSearch.style.display = 'block';
                if (ownerDiv) ownerDiv.innerHTML = '';
                if (adminDiv) adminDiv.innerHTML = '';
                if (memberDiv) memberDiv.innerHTML = '';
            }

            function createBtnTap() {
                if (newGroup) newGroup.innerHTML = '';
                if (findMember) findMember.value = '';
                if (memberSearchResult) memberSearchResult.innerHTML = '';
                if (groupchatForm) groupchatForm.style.display = 'none';
                if (showMessage) showMessage.style.display = 'none';
                if (closeMember) closeMember.style.display = 'none';
                if (memberSearch) memberSearch.style.display = 'none';
                if (ownerDiv) ownerDiv.innerHTML = '';
                if (adminDiv) adminDiv.innerHTML = '';
                if (memberDiv) memberDiv.innerHTML = '';
            }

            function parseJwt(token) {
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = decodeURIComponent(atob(base64Url).split('').map(c =>
                        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                    ).join(''));
                    return JSON.parse(base64);
                } catch (error) {
                    console.error('Error parsing JWT:', error);
                    return null;
                }
            }

            if (memberSearch) {
                memberSearch.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const searchValue = findMember.value.trim();

                    try {
                        const response = await axios.post('http://localhost:4000/admin/searchMember', {
                            searchTerm: searchValue,
                            groupId: groupId
                        }, { headers: { Authorization: `Bearer ${token}` } });

                        const users = response.data;

                        memberSearchResult.innerHTML = '';
                        if (users.userfound) {
                            memberSearchResult.innerHTML = `
                                <div class="user${users.user.id}">
                                    <span class="userName">${users.user.name}</span>
                                    <button class="addMember" id="${users.user.id}">Add Member</button>
                                </div>
                            `;
                        } else {
                            memberSearchResult.innerHTML = `
                                <div>
                                    <span>No users found.</span>
                                </div>
                            `;
                        }
                    } catch (err) {
                        console.error('Error fetching users:', err);
                        memberSearchResult.innerHTML = `
                            <div>
                                <span>An error occurred. Please try again.</span>
                            </div>
                        `;
                    }
                });
            }

            if (memberSearchResult) {
                memberSearchResult.addEventListener('click', async (e) => {
                    if (e.target.classList.contains('addMember')) {
                        const userId = e.target.id;
                        try {
                            await axios.post('http://localhost:4000/admin/addMember', {
                                userId: userId,
                                groupId: groupId
                            }, { headers: { Authorization: `Bearer ${token}` } });

                            alert('User added successfully!');
                            if (groupMembersCount) groupMembersCount.click();
                        } catch (err) {
                            console.error('Error adding member:', err);
                        }
                    }
                });
            }

            const memberPrint = (member, isAdmin, isOwner) => {
                let memberHTML = `
                    <div class="member${member.id}">
                        <span class="memberName" id="${member.id}">${member.user.name}</span>
                        <span class="memberRank" id="${member.id}">${member.rank}</span>
                    </div>
                `;

                if (isAdmin || isOwner) {
                    if (member.rank === 'Member') {
                        memberHTML += `
                            <div class="member${member.id}">
                                <button class="promote" id="${member.id}">Promote</button>
                                <button class="remove" id="${member.id}">Remove</button>
                            </div>
                        `;
                    } else if (member.rank === 'Admin') {
                        memberHTML += `
                            <div class="member${member.id}">
                                <button class="demote" id="${member.id}">Demote</button>
                                <button class="remove" id="${member.id}">Remove</button>
                            </div>
                        `;
                    }
                }

                return memberHTML;
            };

            const memberList = (members) => {
                messageToMemberOpen();
                const userID = parseJwt(token).userID;

                function findRank(members, userID) {
                    for (let member of members) {
                        if (member.user.id === userID) {
                            return member.rank;
                        }
                    }
                    return null;
                }

                myRankInActiveGroup = findRank(members, userID);

                if (members.length > 0) {
                    members.forEach(member => {
                        if (member.rank === 'Owner' && ownerDiv) {
                            ownerDiv.innerHTML += memberPrint(member, false, false);
                        } else if (member.rank === 'Admin' && adminDiv) {
                            adminDiv.innerHTML += memberPrint(member, myRankInActiveGroup === 'Owner', false);
                        } else if (member.rank === 'Member' && memberDiv) {
                            memberDiv.innerHTML += memberPrint(member, myRankInActiveGroup === 'Owner' || myRankInActiveGroup === 'Admin', false);
                        }
                    });
                }
            };

            if (groupMembersCount) {
                groupMembersCount.addEventListener('click', async () => {
                    try {
                        const allMembers = await axios.get(`http://localhost:4000/admin/membersDetails/${groupId}`, { headers: { Authorization: `Bearer ${token}` } });
                        memberList(allMembers.data);
                    } catch (err) {
                        console.error('Error Caught: ', err);
                    }
                });
            }

            if (memberSection) {
                memberSection.addEventListener('click', async (e) => {
                    try {
                        if (e.target.classList.contains('promote') || e.target.classList.contains('demote')) {
                            const promoteMember = await axios.post(`http://localhost:4000/admin/promoteDemote`, {
                                groupId: groupId,
                                targetMember: e.target.id
                            }, { headers: { Authorization: `Bearer ${token}` } });

                            const rankSpan = document.querySelector(`.memberRank[id='${e.target.id}']`);
                            if (rankSpan) {
                                if (promoteMember.data.rank === 'Admin') {
                                    rankSpan.innerHTML = 'Admin';
                                    e.target.classList = 'demote';
                                    e.target.innerHTML = 'Demote';
                                } else {
                                    rankSpan.innerHTML = 'Member';
                                    e.target.classList = 'promote';
                                    e.target.innerHTML = 'Promote';
                                }
                            }

                            if (memberDiv) memberDiv.innerHTML = '';
                            if (adminDiv) adminDiv.innerHTML = '';
                            if (ownerDiv) ownerDiv.innerHTML = '';
                            const allMembers = await axios.get(`http://localhost:4000/admin/membersDetails/${groupId}`, { headers: { Authorization: `Bearer ${token}` } });
                            memberList(allMembers.data);
                        } else if (e.target.classList.contains('remove')) {
                            await axios.post(`http://localhost:4000/admin/removeMember`, {
                                groupId: groupId,
                                targetMember: e.target.id
                            }, { headers: { Authorization: `Bearer ${token}` } });

                            if (memberDiv) memberDiv.innerHTML = '';
                            if (adminDiv) adminDiv.innerHTML = '';
                            if (ownerDiv) ownerDiv.innerHTML = '';
                            const allMembers = await axios.get(`http://localhost:4000/admin/membersDetails/${groupId}`, { headers: { Authorization: `Bearer ${token}` } });
                            memberList(allMembers.data);
                        }
                    } catch (err) {
                        console.error('Error updating member:', err);
                    }
                });
            }
        });