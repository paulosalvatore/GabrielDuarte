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

    const body = $('body');

    $('.project .link').on('click', () => {
        projectShareLink.hide();

        projectDetailsModal.show();

        body.css('overflow', 'hidden');
    });

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

    // Search Autocomplete

    const countries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua &amp; Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia &amp; Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central Arfrican Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D Ivoire', 'Croatia', 'Cuba', 'Curacao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauro', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Pierre &amp; Miquelon', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'St Kitts &amp; Nevis', 'St Lucia', 'St Vincent', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor L\'Este', 'Togo', 'Tonga', 'Trinidad &amp; Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks &amp; Caicos', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States of America', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'];

    const searchInput = $('.search');

    searchInput.each(function() {
        autocomplete($(this)[0], countries);
    });
});
