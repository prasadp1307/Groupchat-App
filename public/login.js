document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.loginForm');
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');

    // login data submission
    loginForm.addEventListener('submit', loginSubmit);
    async function loginSubmit(e) {
        e.preventDefault();

        // Check if email is valid
        if (!email.value.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }

        // Check if password is provided
        if (password.value.length < 4 || password.value.length > 8) {
            alert('Password must be between 4 to 8 characters long.');
            return;
        }

        try {
            const loginSubmitedData = await axios.post(`http://localhost:4000/user/login`, {
                email: email.value,
                password: password.value
            });

            // Store token in local storage
            localStorage.setItem('token', loginSubmitedData.data.token);

            // Alert success message and redirect
            if (!alert(loginSubmitedData.data.message)) {
                window.location.href = "./chat.html";
            }
        } catch (err) {
            // Check for specific error responses
            if (err.response) {
                if (err.response.status === 404) {
                    alert('User not found. Please check your email and try again.');
                } else if (err.response.status === 401) {
                    alert('Incorrect password. Please try again.');
                } else {
                    alert('An error occurred. Please try again later.');
                }
            } else {
                console.log(err);
            }
        }
    }
});
