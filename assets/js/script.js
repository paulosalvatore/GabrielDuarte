$(function () {
    const projectDetails = $('#projectDetails');

    const body = $('body');

    $('.project .link').on('click', function() {
        projectDetails.show();

        body.css('overflow', 'hidden');
    });
});
