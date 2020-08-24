// Get the body
const body = $('body');

// Get the modal
const modal = $('#projectDetails');

// When the user clicks anywhere outside of the modal, close it
body.on('click', event => {
    if (event.target === modal[0]) {
        modal.fadeOut(600, () => {
            body.css('overflow', 'auto');
        });
    }
});
