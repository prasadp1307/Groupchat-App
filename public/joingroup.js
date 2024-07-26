// document.addEventListener('DOMContentLoaded', () => {
//     const newGroup = document.querySelector('.newGroup');
//     const closeMember = document.querySelector('.closeMember');
//     const groupMembersCount = document.querySelector('.groupMembersCount');
//     const memberSection = document.querySelector('.member');
//     const memberSearch = document.querySelector('.memberSearch');
//     const memberSearchResult = document.querySelector('.memberSearchResult');
//     const findMember = document.querySelector('#findMember');
//     const showMessage = document.querySelector('.showMessage');
//     const groupchatForm = document.querySelector('.chatForm.groupForm');
    
//     let myRankInActiveGroup = null;

//     function memberToMessageOpen() {
//         newGroup.innerHTML = '';
//         findMember.value = '';
//         memberSearchResult.innerHTML = '';
//         closeMember.style.display = 'none';
//         memberSearch.style.display = 'none';
//         memberSearchResult.innerHTML = '';
//         showMessage.style.display = 'block';
//         groupchatForm.style.display = 'flex';
//     }

//     function messageToMemberOpen() {
//         newGroup.innerHTML = '';
//         findMember.value = '';
//         memberSearchResult.innerHTML = '';
//         showMessage.style.display = 'none';
//         groupchatForm.style.display = 'none';
//         closeMember.style.display = 'block';
//         memberSearch.style.display = 'block';
//     }

//     function createBtnTap() {
//         newGroup.innerHTML = '';
//         findMember.value = '';
//         memberSearchResult.innerHTML = '';
//         groupchatForm.style.display = 'none';
//         showMessage.style.display = 'none';
//         closeMember.style.display = 'none';
//         memberSearch.style.display = 'none';
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
//             if (member.rank === 'Member') {
//                 memberDiv.innerHTML += memberHTML;
//             } else if (member.rank === 'Admin') {
//                 adminDiv.innerHTML += memberHTML;
//             } else {
//                 ownerDiv.innerHTML += memberHTML;
//             }
//         });
//     };

//     groupMembersCount.addEventListener('click', async (e) => {
//         const groupId = localStorage.getItem('groupId');
//         try {
//             console.log('Fetching all members for group:', groupId); // Debugging log
//             const allMembers = await axios.get(`http://localhost:4000/admin/membersDetails/${groupId}`, { headers: { Authorization: token } });
//             console.log('All members fetched:', allMembers.data); // Debugging log
//             memberList(allMembers.data);
//         } catch (err) {
//             console.error('Error Caught: ', err);
//         }
//     });

//     memberSection.addEventListener('click', async (e) => {
//         const groupId = +localStorage.getItem('groupId');
//         try {
//             if (e.target.classList.contains('promote') || e.target.classList.contains('demote')) {
//                 const promoteMember = await axios.post(`http://localhost:4000/admin/promoteDemote`, {
//                     groupId: groupId,
//                     targetMember: e.target.id
//                 }, { headers: { Authorization: token } });

//                 const rankSpan = document.querySelector(`.memberRank[id='${e.target.id}']`);
//                 if (promoteMember.data.rank === 'Admin') {
//                     rankSpan.innerHTML = 'Admin';
//                     e.target.classList = 'demote';
//                     e.target.innerHTML = 'Demote';
//                 } else {
//                     rankSpan.innerHTML = 'Member';
//                     e.target.classList = 'promote';
//                     e.target.innerHTML = 'Promote';
//                 }
//             } else if (e.target.classList.contains('remove')) {
//                 const removeMember = await axios.post(`http://localhost:4000/admin/removeMember`, {
//                     groupId: groupId,
//                     targetMember: e.target.id
//                 }, { headers: { Authorization: token } });

//                 const membersCountElement = document.querySelector('.groupMembersCount p');
//                 let currentCount = parseInt(membersCountElement.textContent.split(': ')[1]);
//                 let newCount = currentCount - 1;
//                 membersCountElement.textContent = `Members: ${newCount}`;

//                 const rmUserDivs = document.querySelectorAll(`.member${e.target.id}`);
//                 rmUserDivs.forEach(div => div.remove());
//             }
//         } catch (err) {
//             console.error('Error Caught: ', err);
//         }
//     });

//     memberSearch.addEventListener('submit', async (e) => {
//         const groupId = +localStorage.getItem('groupId');
//         try {
//             e.preventDefault();
//             const nameOrEmailOrNumber = findMember.value;
//             console.log('Searching for member with:', nameOrEmailOrNumber); // Debugging log

//             function isEmail(str) {
//                 const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//                 return regex.test(str);
//             }

//             const findingMember = await axios.post(`http://localhost:4000/admin/searchMember`, {
//                 name: isEmail(nameOrEmailOrNumber) || !isNaN(+nameOrEmailOrNumber) ? NaN : nameOrEmailOrNumber,
//                 email: isEmail(nameOrEmailOrNumber) ? nameOrEmailOrNumber : NaN,
//                 number: !isNaN(+nameOrEmailOrNumber) ? nameOrEmailOrNumber : NaN,
//                 groupId: groupId
//             }, { headers: { Authorization: token } });

//             console.log('Search result:', findingMember.data); // Debugging log
//             messageToMemberOpen();

//             if (!findingMember.data.userfound) {
//                 memberSearchResult.innerHTML = `
//                     <div class="usrNotFound">
//                         <span class="memberName">User Not Found.</span>
//                     </div>
//                 `;
//             } else if (!findingMember.data.inGroup) {
//                 const member = findingMember.data;
//                 memberSearchResult.innerHTML = `
//                     <div class="user${member.user.id}">
//                         <span class="userName" id="${member.user.id}">${member.user.name}</span>
//                     </div>
//                     <div class="user${member.user.id}">
//                         <button class="addMember" id="${member.user.id}">Add Member</button>
//                     </div>
//                 `;
//             } else {
//                 const isAdmin = myRankInActiveGroup === 'Admin';
//                 const isOwner = myRankInActiveGroup === 'Owner';
//                 const member = findingMember.data;
//                 memberSearchResult.innerHTML = memberPrint(member, isAdmin, isOwner);
//             }
//         } catch (err) {
//             console.error('Error Caught: ', err);
//         }
//     });

//     closeMember.addEventListener('click', () => {
//         memberToMessageOpen();
//     });

//     memberSearchResult.addEventListener('click', async (e) => {
//         const groupId = +localStorage.getItem('groupId');
//         try {
//             if (e.target.classList.contains('addMember')) {
//                 const addingMember = await axios.post(`http://localhost:4000/admin/addMember`, {
//                     userId: e.target.id,
//                     groupId: groupId
//                 }, { headers: { Authorization: token } });
                
//                 groupMembersCount.click();
//             }
//         } catch (err) {
//             console.error('Error Caught: ', err);
//         }
//     });
// });
