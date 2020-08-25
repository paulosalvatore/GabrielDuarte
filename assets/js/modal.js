// Get the body
const body = $('body');

// Get the modal
const modal = $('#project_details');

// When the user clicks anywhere outside of the modal, close it
body.on('click', event => {
    if (event.target === modal[0]) {
        modal.hide();

        modal.find('iframe').each(function () {
            $(this).attr('src', $(this).attr('src'));
        });

        body.css('overflow', 'auto');
    }
});
