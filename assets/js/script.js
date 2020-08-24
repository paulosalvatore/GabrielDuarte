// Animate scroll
const moveTo = (
    element,
    options = {
        container: undefined,
        callback: undefined
    }
) => {
    if (!options.container) {
        options.container = $('html, body');
    }

    const callbackWrapper = () => {
        if (options.callback) {
            options.callback();
        }
    }

    options.container
        .animate({
            scrollTop: element.offset().top - 87
        }, 'slow', callbackWrapper);
};

$(function () {
    // Modal display
    const projectDetailsModal = $('#projectDetails');

    const body = $('body');

    $('.project .link').on('click', function () {
        projectDetailsModal.show();

        body.css('overflow', 'hidden');
    });

    // Button Share Link

    const projectShareLink = $('.project__share_link');

    projectShareLink.hide();

    const urlInput = $('.project__share_link_url');

    const selectUrlInput = () => {
        moveTo(urlInput, {
            container: projectDetailsModal,
            callback: () => {
                urlInput.focus();
            },
        });

        urlInput[0].select();
        urlInput[0].setSelectionRange(0, 99999); // For mobile devices
    };

    $('.urlInput').on('click', selectUrlInput);

    $('.share_link').on('click', function () {
        const slideDuration = 200;

        if (projectShareLink.css('display') === 'none') {
            projectShareLink.slideDown(slideDuration, selectUrlInput);
        } else {
            projectShareLink.slideUp(slideDuration, selectUrlInput);
        }
    });

    const shareLinkCopy = $('.project__share_link_copy');

    shareLinkCopy.popover({
        trigger: 'focus'
    });

    shareLinkCopy.on('click', function () {
        selectUrlInput();

        document.execCommand('copy'); // Copy the text inside the text field
    });
});
