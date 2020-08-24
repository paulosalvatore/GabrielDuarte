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
    // Project Share Link
    const projectShareLink = $('.project__share_link');

    // Modal display
    const projectDetailsModal = $('#projectDetails');

    // Button Share Link
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
            projectShareLink.slideUp(slideDuration);
        }
    });

    const shareLinkCopy = $('.project__share_link_copy');

    shareLinkCopy.popover();

    body.on('click', () => {
        shareLinkCopy.popover('hide');
    });

    shareLinkCopy.on('click', function (event) {
        shareLinkCopy.popover('show');

        selectUrlInput();

        document.execCommand('copy'); // Copy the text inside the text field

        event.stopPropagation();
    });
});
