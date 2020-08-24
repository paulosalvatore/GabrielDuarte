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

const loadYouTubeImage = project => 'https://img.youtube.com/vi/nK0L51DUf9I/hqdefault.jpg';

const createProjectElement = (project, index) => {
    const cloneElement = projectBaseElement.clone();
    cloneElement.attr('id', '');

    cloneElement.addClass('style_' + index)

    // Change image

    const imageUrl = project.imagem || loadYouTubeImage(project);
    const imageElement = cloneElement.find('.image');

    imageElement.find('.project__image').css('background-image', `url('${imageUrl}')`);

    // Title and subtitle

    cloneElement.find('.project__title').text(project.titulo);

    const subtitleElement = cloneElement.find('.project__subtitle');

    if (project.subtitulo) {
        subtitleElement.text(project.subtitulo);
    } else {
        subtitleElement.hide();
    }

    // Tags

    const projectTagsElement = cloneElement.find('.project__tags');
    const projectTagBase = projectTagsElement.find('.project__tag');

    const tagsLength = !project.tags ? 0 : project.tags.length;
    for (let i = 0; i < Math.min(visibleTagsAmount, tagsLength); i++) {
        const tag = project.tags[i];

        const projectTagClone = projectTagBase.clone();

        projectTagClone.text(tag);

        projectTagsElement.append(projectTagClone);
    }

    projectTagBase.remove();

    // Add new element to projectBaseElement's parent

    projectBaseElement.parent().append(cloneElement);
};

const createProjectElements = projects => {
    projects.forEach(createProjectElement);
};

const dataReady = () => {
    if (!projects.length
        || !colors.length
        || !tags.length) {
        return;
    }

    createProjectElements(projects);
};
