document.addEventListener('DOMContentLoaded', () => {
    const newGroup = document.querySelector('.newGroup');
    const cancelBtn = document.querySelector('.cancelBtn');
    const createForm = document.querySelector('.createForm');

    // Check if the elements are not null
    if (newGroup && cancelBtn && createForm) {
        cancelBtn.addEventListener('click', (e) => {
            console.log('Cancel button clicked');
            newGroup.innerHTML = '';
        });

        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Form submitted');
            // Your form submission logic here
        });
    } else {
        console.error('One or more elements are missing in the DOM.');
    }
});
