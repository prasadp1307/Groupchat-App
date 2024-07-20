const signupForm = document.querySelector('.signupForm');
const name = document.querySelector('#username');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirm-password');
const number = document.querySelector('#phone');

// Signup data submission
signupForm.addEventListener('submit', signupSubmit);
async function signupSubmit(e) {
    e.preventDefault();

    // Password validation
    const passwordValue = password.value;
    const confirmPasswordValue = confirmPassword.value;

    if (passwordValue.length < 4 || passwordValue.length > 8) {
        alert('Password must be between 4 to 8 characters long.');
        return;
    }

    if (!isAlphanumeric(passwordValue)) {
        alert('Password must be alphanumeric (letters and numbers only).');
        return;
    }

    if (passwordValue !== confirmPasswordValue) {
        alert('Password and confirm password do not match.');
        return;
    }

    try {
        const signupSubmittedData = await axios.post(`http://localhost:4000/user/signup`, {
            name: name.value,
            email: email.value,
            password: passwordValue,
            number: number.value
        });

        if (!alert(signupSubmittedData.data.message)) {
            window.location.href = 'login.html';
        }
    } catch (err) {
        if (err.response && err.response.status === 302) {
            if (!alert(err.response.data.message)) {
                location.reload();
            }
        } else {
            console.log(err);
        }
    }
}

function isAlphanumeric(str) {
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (!(charCode >= 48 && charCode <= 57) && // 0-9
            !(charCode >= 65 && charCode <= 90) && // A-Z
            !(charCode >= 97 && charCode <= 122)) { // a-z
            return false;
        }
    }
    return true;
}












// const signupForm = document.querySelector('.signupForm');
// const name = document.querySelector('#username');
// const email = document.querySelector('#email');
// const password = document.querySelector('#password');
// const confirmPassword = document.querySelector('#confirm-password');
// const number = document.querySelector('#phone');

// // Signup data submission
// signupForm.addEventListener('submit', signupSubmit);
// async function signupSubmit(e) {
//     e.preventDefault();

//     // Password validation
//     const passwordValue = password.value;
//     const confirmPasswordValue = confirmPassword.value;

//     if (passwordValue !== confirmPasswordValue) {
//         alert('Passwords do not match.');
//         return;
//     }

//     if (passwordValue.length < 4 || passwordValue.length > 8) {
//         alert('Password must be between 4 to 8 characters long.');
//         return;
//     }

//     if (!/^[a-zA-Z0-9]+$/.test(passwordValue)) {
//         alert('Password must be alphanumeric (letters and numbers only).');
//         return;
//     }

//     try {
//         const signupSubmittedData = await axios.post(`http://localhost:4000/signup`, {  
//             name: name.value,
//             email: email.value,
//             password: passwordValue,
//             number: number.value
//         });

//         if (!alert(signupSubmittedData.data.message)) {
//             window.location.href = 'login.html';
//         }
//     } catch (err) {
//         if (err.response && err.response.status === 302) {
//             if (!alert(err.response.data.message)) {
//                 location.reload();
//             }
//         } else {
//             console.log(err);
//         }
//     }
// }
