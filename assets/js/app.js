/*SCROLL BAR*/
//selection ID 
let progress=document.getElementById('progressBar');
//definir totalHeight -> 
//scrollHeight -> valeur total de la hauteur 
// window.innerHeight-> hauteur visible à l'ecran
let totalHeight=document.body.scrollHeight - window.innerHeight;

 //au scroll on recupere la valeur en pourcent de la où on se trouve
 //pageYOffSet -> valeur en pixel d'ou on se trouver sur l'ecran 
 //Puis ensuite on le convertis en %
 window.onscroll = function(){
     let progressHeight=(window.pageYOffset / totalHeight) *100;
     progress.style.height= progressHeight + "%";
 }


// Valeurs initiales
// LOrsqu'on arrive sur la page les premiers films seront les seigneurs des anneaux
const INITIAL_SEARCH_VALUE = 'Seigneur des anneaux';
const log = console.log;

// Selection des éléments en HTM<l
const searchButton = document.querySelector('#search');;
const searchInput = document.querySelector('#exampleInputEmail1');
const moviesContainer = document.querySelector('#movies-container');
const moviesSearchable = document.querySelector('#movies-searchable');

//Création de la class imageContainer dans la partie Movie searchable
//image container contiendra les images des films recherché
function createImageContainer(imageUrl, id) {
    const tempDiv = document.createElement('div');
    tempDiv.setAttribute('class', 'imageContainer');
    tempDiv.setAttribute('data-id', id);

    const movieElement = `
        <img src="${imageUrl}" alt="" data-movie-id="${id}">
    `;
    tempDiv.innerHTML = movieElement;

    return tempDiv;
}

//fonction reset
function resetInput() {
    searchInput.value = '';
}

//message d'erreurs
function handleGeneralError(error) {
    log('Error: ', error.message);
    alert(error.message || 'Internal Server');
}

//Création de la class iframe -> dans la partie movie searchable
// le iframe apparaitra si on clique sur l'affiche d'un des films
// on met ensuite les valeurs css de l'iframe
function createIframe(video) {
    const videoKey = (video && video.key) || 'No key found!!!';
    const iframe = document.createElement('iframe');
    iframe.src = `http://www.youtube.com/embed/${videoKey}`;
    iframe.width = 360;
    iframe.height = 315;
    iframe.allowFullscreen = true;
    return iframe;
}

//insertion dans l'iframe des données de vidéo
function insertIframeIntoContent(video, content) {
    const videoContent = document.createElement('div');
    const iframe = createIframe(video);

    videoContent.appendChild(iframe);
    content.appendChild(videoContent);
}

//Template de la vidéo 
function createVideoTemplate(data) {
    const content = this.content;
    content.innerHTML = '<button class="btn btn-dark" id="content-close">X</button>';
    
    const videos = data.results || [];

    if (videos.length === 0) {
        content.innerHTML = `
            <button class="btn btn-dark" id="content-close">X</button>
            <p>No Trailer found for this video id of ${data.id}</p>
        `;
        return;
    }

    for (let i = 0; i < 4; i++) {
        const video = videos[i];
        insertIframeIntoContent(video, content);
    }
}

//section titre (Ex : Trending movie ou top rated movie)
function createSectionHeader(title) {
    const header = document.createElement('h2');
    header.innerHTML = title;
    header.style.textDecoration = "underline";

    return header;
}


function renderMovies(data) {
    const moviesBlock = generateMoviesBlock(data);
    const header = createSectionHeader(this.title);
    moviesBlock.insertBefore(header, moviesBlock.firstChild);
    moviesContainer.appendChild(moviesBlock);
}


function renderSearchMovies(data) {
    moviesSearchable.innerHTML = '';
    const moviesBlock = generateMoviesBlock(data);
    moviesSearchable.appendChild(moviesBlock);
}

//film (avec image) non cherché -> section qui se créer dans movie container 
function generateMoviesBlock(data) {
    const movies = data.results;
    const section = document.createElement('section');
    section.setAttribute('class', 'section');

    for (let i = 0; i < movies.length; i++) {
        const { poster_path, id } = movies[i];

        if (poster_path) {
            const imageUrl = MOVIE_DB_IMAGE_ENDPOINT + poster_path;
    
            const imageContainer = createImageContainer(imageUrl, id);
            section.appendChild(imageContainer);
        }
    }

    const movieSectionAndContent = createMovieContainer(section);
    return movieSectionAndContent;
}



// insetion de la section avant le contenu de l'element 
function createMovieContainer(section) {
    const movieElement = document.createElement('div');
    movieElement.setAttribute('class', 'movie');

    const template = `
        <div class="content">
            <p id="content-close">X</p>
        </div>
    `;

    movieElement.innerHTML = template;
    movieElement.insertBefore(section, movieElement.firstChild);
    return movieElement;
}

//onclick sur le bouton cherché -> input valeur de la recherche
searchButton.onclick = function (event) {
    event.preventDefault();
    const value = searchInput.value

   if (value) {
    searchMovie(value);
   }
    resetInput();
}

// Click sur un film -> affichage des elements sur le film ( vidéos )
document.onclick = function (event) {
    log('Event: ', event);
    const { tagName, id } = event.target;
    if (tagName.toLowerCase() === 'img') {
        const movieId = event.target.dataset.movieId;
        const section = event.target.parentElement.parentElement;
        const content = section.nextElementSibling;
        content.classList.add('content-display');
        getVideosByMovieId(movieId, content);
    }

    if (id === 'content-close') {
        const content = event.target.parentElement;
        content.classList.remove('content-display');
    }
}

// Initialiser la recherche
searchMovie(INITIAL_SEARCH_VALUE);
searchUpcomingMovies();
getTopRatedMovies();
searchPopularMovie();
getTrendingMovies();

