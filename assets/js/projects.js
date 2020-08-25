// Configuration

const visibleTagsAmount = 3;

const mediaBaseUrl = 'https://github.com/paulosalvatore/GabrielDuarte/raw/master/media';
const getProxyUrl = url => `https://cors-anywhere.herokuapp.com/${url}`;

// Load JSON data

let projects = [];
let colors = [];
let tags = [];

const createColorsClasses = () => {
    const style = document.createElement('style');
    style.type = 'text/css';

    colors.forEach((color, index) => {
        style.innerHTML += `.tiles article.style_${index} > .image:before { background-color: #${color}; }\n`;
    });

    document.getElementsByTagName('head')[0].appendChild(style);
};

$.getJSON('data/colors.json', data => {
    colors = data;

    createColorsClasses();

    dataReady();
});

$.getJSON('data/projects.json', data => {
    projects = data;

    dataReady();
});

$.getJSON('data/tags.json', data => {
    tags = data;

    dataReady();
});

const projectBaseElement = $('#project_base');

function getYouTubeVideoId(project) {
    let videoId = undefined;

    if (project.youtube) {
        const url = new URL(project.youtube);

        videoId = url.pathname.includes('watch') ? url.searchParams.get('v') : url.pathname.slice(1);
    }

    return videoId;
}

const getYouTubeImageUrl = project => {
    const videoId = getYouTubeVideoId(project);

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

const getYouTubeIframeUrl = project => {
    const videoId = getYouTubeVideoId(project);

    return `https://www.youtube.com/embed/${videoId}`;
};

const clearUrl = text => encodeURIComponent(text.replace(/ /g, '_'));

const getProjectUrl = project => {
    const pageUrl = new URL(document.URL);
    return `${pageUrl.origin}${pageUrl.pathname}#projeto_${clearUrl(project.id)}`;
};

const createProjectElement = (project, index) => {
    // Clone base element
    const projectElement = projectBaseElement.clone();

    // Remove base element's id
    projectElement.removeAttr('id');

    // Set data-project based on index
    projectElement.data('project', index);

    // Add element's class based on index
    projectElement.addClass('style_' + index);

    // Change image

    const imageUrl = project.imagem || getYouTubeImageUrl(project);
    const imageElement = projectElement.find('.image');

    imageElement.find('.project__image').css('background-image', `url('${imageUrl}')`);

    // Title and subtitle

    projectElement.find('.project__title').text(project.titulo);

    const subtitleElement = projectElement.find('.project__subtitle');

    if (project.subtitulo) {
        subtitleElement.text(project.subtitulo);
    } else {
        subtitleElement.hide();
    }

    // Tags

    const projectTagsElement = projectElement.find('.project__tags');
    const projectTagBase = projectTagsElement.find('.project__tag');

    const tagsLength = !project.tags ? 0 : project.tags.length;
    for (let i = 0; i < Math.min(visibleTagsAmount, tagsLength); i++) {
        const tag = project.tags[i];

        const projectTagClone = projectTagBase.clone();

        projectTagClone.text(tag);

        projectTagsElement.append(projectTagClone);
    }

    projectTagBase.remove();

    // Link
    const link = getProjectUrl(project);
    projectElement.find('a').attr('href', link);

    // Update visibility based on 'project.principal' value
    if (!project.principal) {
        projectElement.hide();
    }

    // Add new element to projectBaseElement's parent
    projectBaseElement.parent().append(projectElement);
};

// HTML Elements
const projectDetailsModal = $('#projectDetails');

const youtubeIframe = $('#youtube_iframe');
const youtubeIframeWrapper = $('#youtube_iframe_wrapper');

const soundcloudIframeWrapper = $('#soundcloud_iframe_wrapper');

const projectShareLink = $('.project__share_link');

const videoButton = $('#media_video_button');
const audioButton = $('#media_audio_button');

const loadMediaUrl = (project, mediaType) => {
    const fileExtension = mediaType === 'VIDEO' ? 'mp4' : 'mp3';
    return `${mediaBaseUrl}/${mediaType.toLowerCase()}/${project.id}.${fileExtension}`;
};

const downloadAudio = (project) => {
    const url = loadMediaUrl(project, 'AUDIO');

    const x = new XMLHttpRequest();
    x.open('GET', getProxyUrl(url), true);
    x.responseType = 'blob';

    x.onload = () => {
        if (x.response.type === 'audio/mpeg') {
            download(x.response, `${project.id}.mp3`, 'audio/mpeg');
        }
    };

    x.send();
};

const downloadVideo = project => {
    const url = loadMediaUrl(project, 'VIDEO');

    $.fileDownload(url);
};

let modalProject;

const loadEvents = function () {
    // Modal display

    $('.project .link').on('click', function () {
        // Load Project
        const projectIndex = $(this).closest('.project').data('project');
        const project = projects[projectIndex];

        if (modalProject !== project) {
            modalProject = project;

            // Reset iframe's visibility and content to force them to reload

            youtubeIframeWrapper.hide();
            youtubeIframeWrapper.html('');

            soundcloudIframeWrapper.hide();
            soundcloudIframeWrapper.html('');

            // Load iframe for YouTube or SoundCloud

            if (project.tipo === 'VIDEO' && project.youtube) {
                const iframe = youtubeIframe.clone();
                iframe.attr('src', getYouTubeIframeUrl(project));
                youtubeIframeWrapper.append(iframe);
                youtubeIframeWrapper.show();
            } else if (project.tipo === 'AUDIO' && project.soundcloud) {
                soundcloudIframeWrapper.html(project.soundcloud);
                soundcloudIframeWrapper.show();
            }

            // Update URL input

            const urlInput = $('.project__share_link_url');
            urlInput.val(getProjectUrl(project));

            // Hide share link by default

            projectShareLink.hide();

            // Set download's button URL for audio and video files

            videoButton.hide();
            audioButton.hide();

            if (project.tipo === 'VIDEO') {
                // Both buttons should be visible
                videoButton.show();
                audioButton.show();

                videoButton.unbind().on('click', () => {
                    downloadVideo(project);
                });

                audioButton.unbind().on('click', () => {
                    downloadAudio(project);
                });
            } else if (project.tipo === 'AUDIO') {
                // Only audio button should be visible
                videoButton.hide();
                audioButton.show();

                audioButton.unbind().on('click', () => {
                    downloadAudio(project);
                });
            }
        }

        // Display modal and hide body's overflow

        projectDetailsModal.show();

        $('body').css('overflow', 'hidden');
    });
};

const loadAutocomplete = () => {
    // Search Autocomplete
    const tags = Array.from(new Set(projects.map(project => project.tags).flat()));

    const searchInput = $('.search');

    searchInput.each(function () {
        autocomplete($(this)[0], tags);
    });
};

const createProjectElements = projects => {
    projects.forEach(createProjectElement);

    loadEvents();

    loadAutocomplete();
};

const dataReady = () => {
    if (!projects.length
        || !colors.length
        || !tags.length) {
        return;
    }

    createProjectElements(projects);
};
