/*
https://youtu.be/nK0L51DUf9I
https://www.youtube.com/watch?v=nK0L51DUf9I&feature=youtu.be

Extrair ID: nK0L51DUf9I

Transformar em: https://www.youtube.com/embed/{video_id}
*/

/*
// Funcionamento
- Quando tem vídeo:
Pode baixar só o áudio e só o vídeo
- Quando só tem áudio:
Download só do áudio
*/

// Load JSON data

let projects = [];
let colors = [];
let tags = [];

const visibleTagsAmount = 3;

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

const loadYouTubeImage = project => {
    let videoId = undefined;

    if (project.youtube) {
        const url = new URL(project.youtube);

        videoId = url.pathname.includes('watch') ? url.searchParams.get('v') : url.pathname.slice(1);
    }

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

const clearUrl = text => encodeURIComponent(text.replace(/ /g, '_'));

const createProjectElement = (project, index) => {
    // Clone base element
    const projectElement = projectBaseElement.clone();

    // Remove id so element can be shown
    projectElement.removeAttr('id');

    // Set data-project based on index
    projectElement.data('project', index);

    // Add element's class based on index
    projectElement.addClass('style_' + index);

    // Change image

    const imageUrl = project.imagem || loadYouTubeImage(project);
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
    const pageUrl = new URL(document.URL);
    const link = `${pageUrl.origin}${pageUrl.pathname}#projeto_${clearUrl(project.id)}`;
    projectElement.find('a').attr('href', link);

    // Add new element to projectBaseElement's parent
    projectBaseElement.parent().append(projectElement);
};

const loadEvents = function () {
    // Project Share Link
    const projectShareLink = $('.project__share_link');

    // Modal display
    const projectDetailsModal = $('#projectDetails');

    $('.project .link').on('click', function () {
        const projectIndex = $(this).closest('.project').data('project');
        const project = projects[projectIndex];
        console.log(project);

        projectShareLink.hide();

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
