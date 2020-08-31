// Configuration

const visibleTagsAmount = 3;

const levenshteinFactor = 2;

const loadHighResImage = false;

// Media

const mediaFolder = 'media';
const getProxyUrl = function (url) {
    return `https://cors-anywhere.herokuapp.com/${url}`;
};

// Load JSON data

let projects = [];
let colors = [];
let tagsAlias = [];

const createColorsClasses = function () {
    const style = document.createElement('style');
    style.type = 'text/css';

    colors.forEach(function (color, index) {
        style.innerHTML += `.tiles article.style_${index} > .image:before { background-color: #${color}; }\n`;
    });

    document.getElementsByTagName('head')[0].appendChild(style);
};

$.getJSON('data/colors.json', function (data) {
    colors = data;

    createColorsClasses();

    dataReady();
});

$.getJSON('data/projects.json', function (data) {
    projects = data;

    dataReady();
});

$.getJSON('data/tags.json', function (data) {
    tagsAlias = data;

    dataReady();
});

// HTML Elements
const projectBaseElement = $('#project_base');

const projectDetailsModal = $('#project_details');

const youtubeIframe = $('#youtube_iframe');
const youtubeIframeWrapper = $('#youtube_iframe_wrapper');

const soundcloudIframeWrapper = $('#soundcloud_iframe_wrapper');

const projectShareLink = $('.project__share_link');
const searchShareWrapper = $('.project-share-search-wrapper');
const searchUrlInput = $('.project__search_share_link_url');

const videoButton = $('#media_video_button');
const audioButton = $('#media_audio_button');

let projectsElements;

// YouTube helpers

const getYouTubeVideoId = function (project) {
    let videoId = undefined;

    if (project.youtube) {
        const url = new URL(project.youtube);

        videoId = url.pathname.includes('watch') ? url.searchParams.get('v') : url.pathname.slice(1);
    }

    return videoId;
};

const getYouTubeImageUrl = function (project, highRes = false) {
    if (!project.youtube) {
        return 'URL_NOT_FOUND';
    }

    const videoId = getYouTubeVideoId(project);

    const fileName = highRes ? 'maxresdefault' : 'hqdefault';

    return `https://img.youtube.com/vi/${videoId}/${fileName}.jpg`;
};

const getYouTubeIframeUrl = function (project) {
    const videoId = getYouTubeVideoId(project);

    return `https://www.youtube.com/embed/${videoId}`;
};

// Media

const loadMediaUrl = function (project, mediaType) {
    const fileExtension = mediaType === 'VIDEO' ? 'mp4' : 'mp3';
    return `${mediaFolder}/${mediaType.toLowerCase()}/${project.id}.${fileExtension}`;
};

/*
const downloadAudio = function (project) {
    const audioIcon = audioButton.find('.fa');
    const originalClasses = audioIcon.attr('class');
    audioIcon.attr('class', 'fa fa-spinner fa-spin');

    const url = loadMediaUrl(project, 'AUDIO');

    const x = new XMLHttpRequest();
    x.open('GET', getProxyUrl(url), true);
    x.responseType = 'blob';

    x.onload = function () {
        if (x.response.type === 'audio/mpeg') {
            download(x.response, `${project.id}.mp3`, 'audio/mpeg');
        } else {
            alert('Falha ao baixar o arquivo de áudio.');
        }

        audioIcon.attr('class', originalClasses);
    };

    x.send();
};

const downloadVideo = function (project) {
    const videoIcon = videoButton.find('.fa');
    const originalClasses = videoIcon.attr('class');
    videoIcon.attr('class', 'fa fa-spinner fa-spin');

    const url = loadMediaUrl(project, 'VIDEO');

    const x = new XMLHttpRequest();
    x.open('GET', getProxyUrl(url), true);
    x.responseType = 'blob';

    x.onload = function () {
        if (x.response.type === 'application/octet-stream') {
            download(x.response, `${project.id}.mp4`, 'application/octet-stream');
        } else {
            alert('Falha ao baixar o arquivo de vídeo.');
        }

        videoIcon.attr('class', originalClasses);
    };

    x.send();
};
*/

// Modal

let modalProject;

const showModal = function (project) {
    if (!project) {
        return;
    }

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

            const videoUrl = loadMediaUrl(project, 'VIDEO');
            videoButton.attr('href', videoUrl);

            const audioUrl = loadMediaUrl(project, 'AUDIO');
            audioButton.attr('href', audioUrl);
        } else if (project.tipo === 'AUDIO') {
            // Only audio button should be visible
            videoButton.hide();
            audioButton.show();

            videoButton.attr('href', '');

            const audioUrl = loadMediaUrl(project, 'AUDIO');
            audioButton.attr('href', audioUrl);
        }
    }

    // Display modal and hide body's overflow

    const modalContent = $('.modal-content');
    modalContent.css({
        'opacity': 0
    });

    projectDetailsModal.show();

    modalContent.animate({
        'opacity': 1
    })

    $('body').addClass('modal-open');
};

// Projects Elements

const createProjectsElements = function (projects) {
    projects.forEach(createProjectElement);

    projectsElements = $('.project');

    projectsElements.sort(function (a, b) {
        const aIsPrincipal = $(a).data('principal');
        const bIsPrincipal = $(b).data('principal');

        return (aIsPrincipal === bIsPrincipal) ? 0 : aIsPrincipal ? -1 : 1;
    }).appendTo('#projects');

    loadEvents();

    loadAutocomplete();
};

const createProjectElement = function (project, index) {
    // Clone base element
    const projectElement = projectBaseElement.clone();

    // Remove base element's id
    projectElement.removeAttr('id');

    // Set data-project based on index
    projectElement.data('project', clearUrl(project.id));

    // Change image

    const imageUrl = project.imagem || getYouTubeImageUrl(project);
    const imageElement = projectElement.find('.image');

    imageElement
        .find('.project__image')
        .css('background-image', `url('${imageUrl}')`);

    // Try to load image high res

    if (loadHighResImage && !project.imagem) {
        $(function () {
            setTimeout(function () {
                const highResImageUrl = getYouTubeImageUrl(project, true);

                const img = new Image();

                img.onload = function () {
                    if (img.width > 480) {
                        imageElement
                            .find('.project__image')
                            .css('background-image', `url('${highResImageUrl}')`);
                    }
                };

                img.src = highResImageUrl;
            }, 300);
        });
    }

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
    projectElement.find('.link').attr('href', link);

    // Add 'project.principal' to html's data
    projectElement.data('principal', Boolean(project.principal));

    // Add new element to projectBaseElement's parent
    projectBaseElement.parent().append(projectElement);
};

const loadEvents = function () {
    // Modal display
    $('.project .link').on('click', function () {
        // Load Project
        const projectIndex = $(this).closest('.project').data('project');
        const project = projects[projectIndex];

        showModal(project);
    });

    // Tags
    $('.tag').on('click', function (event) {
        const chips = getChipsInstance();

        chips.addChip({
            tag: $(this).text()
        });

        event.preventDefault();
        event.stopPropagation();
    });
};

// URL Helpers

const clearUrl = function (text) {
    return encodeURIComponent(text.replace(/ /g, '_'));
};

const invertClearUrl = function (url) {
    return decodeURIComponent(url).replace(/_/g, ' ');
};

const getProjectUrl = function (project) {
    const pageUrl = new URL(document.URL);

    return `${pageUrl.origin}${pageUrl.pathname}#projeto_${clearUrl(project.id)}`;
};

// String Helper

const clearString = function (tag) {
    return clearAccent(tag.toLowerCase());
};

const clearAccent = function (tag) {
    return tag.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
};

// Projects Helpers

const findByData = function (elements, key, value) {
    return Array.from(elements).reduce(function (acc, curr) {
        if ($(curr).data(key) === value) {
            acc.push(curr);
        }

        return acc;
    }, []);
};

const findProjectsElements = function (projects) {
    return projects.map(function (project) {
        return findByData(projectsElements, 'project', clearUrl(project.id))[0];
    });
};

const updateProjectsElementsColor = function () {
    // Hide all projects' elements
    projectsElements.attr('class', 'project');

    // Add elements' classes based on index, to add sequential colors to them
    $('.project:visible').each(function (index) {
        $(this).addClass('style_' + index % colors.length);
    });
};

const getChipsInstance = function () {
    return M.Chips.getInstance($('.chips'));
};

const loadAutocomplete = function () {
    // Load unique tags based on projects list
    const tags = Array.from(new Set(projects.map(function (project) {
        return project.tags;
    }).flat()));

    // Convert tags array into an object based on 'chips' data format
    const tagsObj = tags.reduce(function (acc, curr) {
        acc[curr] = null;

        return acc;
    }, {});

    // Load materialize's chips
    const updateSearch = function () {
        // Since we have tags to filter, we display only the filtered projects

        // Load chips and get all tags
        const chips = getChipsInstance();
        const tags = chips.chipsData.map(function (chip) {
            return chip.tag;
        });

        const splitTags = tags.map(function (tag) {
            return tag.split(' ');
        }).flat();

        // Load tag aliases
        tagsAlias
            .filter(function (tagAlias) {
                return tagAlias.alias.some(function (alias) {
                    return splitTags.map(clearString).includes(clearString(alias));
                });
            })
            .forEach(function (tagAlias) {
                if (!splitTags.includes(tagAlias.nome)) {
                    tags.push(tagAlias.nome);
                }
            });

        // Hide all elements
        projectsElements.hide();

        // If user has type a tag, find specific projects
        // Otherwhise, display all main projects
        if (tags.length) {
            searchShareWrapper.show();

            const foundProjects = projects.reduce(function (acc, project, i, arr) {
                const keywords = project.tags
                    .concat(
                        project.titulo.split(' '),
                        project.subtitulo ? project.subtitulo.split(' ') : []
                    );

                const found =
                    splitTags.every(function (tag) {
                            return keywords.some(function (keyword) {
                                    return clearString(keyword).includes(clearString(tag))
                                        || levenshteinDistance(clearString(keyword), clearString(tag)) <= levenshteinFactor;
                                }
                            );
                        }
                    );

                if (found) {
                    acc.push(project);
                }

                return acc;
            }, []);

            // Load search url
            const tagsHash = tags.map(clearAccent).map(clearUrl).join('&');
            const url = new URL(document.URL);
            const searchUrl = `${url.origin}${url.pathname}#busca_${tagsHash}`;

            // Update search url input
            searchUrlInput.val(searchUrl);

            if (!globalPopped) {
                // Push a new state to history with a hash based on search input
                history.pushState({}, null, searchUrl);
            }

            findProjectsElements(foundProjects).forEach(function (element) {
                return $(element).show();
            });
        } else {
            // Since we don't have any tags to filter, we display only the main projects

            searchShareWrapper.hide();

            if (!globalPopped) {
                // Push a new state to history without any hashes
                const url = new URL(document.URL);
                history.pushState({}, null, url.origin + url.pathname);
            }

            // Clear search url input
            searchUrlInput.val('');

            // Display all main projects
            const mainProjects = projects.filter(function (project) {
                return project.principal;
            });

            findProjectsElements(mainProjects).forEach(function (element) {
                return $(element).show();
            });
        }

        updateProjectsElementsColor();
    };

    const placeholderDesktop = 'Busque por cliente, mood, interpretação, tipo da peça etc.';
    const placeholderMobile = 'Cliente, mood etc.';

    const isMobile = window.innerWidth <= 620;

    $('.project-search .chips-autocomplete').chips({
        placeholder: isMobile ? placeholderMobile : placeholderDesktop,
        autocompleteOptions: {
            data: tagsObj,
            limit: Infinity,
            minLength: 1
        },
        onChipAdd: function () {
            updateSearch();

            setTimeout(function () {
                $('.chips.input-field .input').trigger('click');
            }, 100);
        },
        onChipDelete: function () {
            updateSearch();

            $('.chips.input-field .input').focus();
        },
        onChipSelect: function (event, chip) {
            const chips = getChipsInstance();

            chips.deleteChip($(chip).index());
        }
    });
};

// Current URL load

let globalPopped;

const loadCurrentUrl = function (popped) {
    globalPopped = popped;

    const url = new URL(document.URL);

    if (url.hash.includes('projeto_')) {
        const projectId = invertClearUrl(url.hash.replace('#projeto_', ''));

        const project = projects.find(function (project) {
            return project.id === projectId;
        });

        showModal(project);
    } else if (modal.css('display') !== 'none') {
        hideModal(popped);
    }

    const chips = getChipsInstance();

    if (url.hash.includes('busca_')) {
        const tags = invertClearUrl(url.hash.replace('#busca_', '')).split('&');

        for (let i = 0; i < chips.chipsData.length; i++) {
            const chip = chips.chipsData[i];

            if (!tags.includes(chip.tag)) {
                chips.deleteChip(i);
            }
        }

        tags.forEach(function (tag) {
            return chips.addChip({tag});
        });
    } else {
        for (let i = 0; i < chips.chipsData.length; i++) {
            chips.deleteChip(i);
        }
    }

    globalPopped = false;
};

// Data Ready

const dataReady = function () {
    if (!projects.length
        || !colors.length
        || !tagsAlias.length) {
        return;
    }

    createProjectsElements(projects);

    updateProjectsElementsColor();

    loadCurrentUrl();

    window.onpopstate = function () {
        loadCurrentUrl(true);
    }
};
