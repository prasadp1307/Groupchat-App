document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.loginForm');
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!email.value.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }

        if (password.value.length < 4 || password.value.length > 8) {
            alert('Password must be between 4 to 8 characters long.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/user/login', {
                email: email.value,
                password: password.value
            });

            // Ensure username is set in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username); 

            window.location.href = './chat.html'; // Redirect to chat page
        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) {
                    alert('User not found. Please check your email and try again.');
                } else if (err.response.status === 401) {
                    alert('Incorrect password. Please try again.');
                } else {
                    alert('An error occurred. Please try again later.');
                }
            } else {
                console.error(err);
            }
        }
    });
});
