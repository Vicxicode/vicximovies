const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    }
})

function createMovies(movies, container) {
    container.innerHTML = '';

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        })
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt',movie.title);
        movieImg.setAttribute('src','https://image.tmdb.org/t/p/w300' + movie.poster_path)
        
        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    });
}

function createCategory(categories, container) {
    container.innerHTML = "";
    categories.forEach(cate => {
        const categorieContainer = document.createElement('div');
        categorieContainer.classList.add('category-container');
        const categorieTitle = document.createElement('h3');
        categorieTitle.classList.add('category-title');
        categorieTitle.setAttribute('id','id'+cate.id);
        categorieTitle.addEventListener('click', () => {
            location.hash = `#category=${cate.id}-${cate.name}`;
        })
        const categorieTitleText = document.createTextNode(cate.name);
        
        categorieTitle.appendChild(categorieTitleText);
        categorieContainer.appendChild(categorieTitle);
        container.appendChild(categorieContainer);
    });
}

async function getTrendingMoviesPreview() {
    const {data} = await api('/trending/movie/day'); 
    const movies = data.results;
    createMovies(movies,trendingMoviesPreviewList);
}

async function getCategoriesPreview() {
    const {data} = await api('/genre/movie/list'); 
    const categories = data.genres;
    createCategory(categories,categoriesPreviewList);
}

async function getMoviesByCategory(id) {
    const {data} = await api('/discover/movie', {
        params: {
            with_genres: id
        }
    }); 
    const movies = data.results;
    createMovies(movies,genericSection);
}

async function getMoviesBySearch(query) {
    const {data} = await api('/search/movie', {
        params: {
            query
        }
    }); 
    const movies = data.results;
    createMovies(movies,genericSection);
}

async function getTrendingMovies() {
    const {data} = await api('/trending/movie/day'); 
    const movies = data.results;
    createMovies(movies,genericSection);
}

async function getMovieById(id) {
    const {data: movie} = await api(`/movie/${id}`); 
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    const movieImg = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    headerSection.style.background = `
    linear-gradient(
        180deg, 
        rgba(0, 0, 0, 0.35) 19.27%, 
        rgba(0, 0, 0, 0) 29.17%
        ),
    url(${movieImg})
    `

    createCategory(movie.genres, movieDetailCategoriesList);
    getRelatedMovies(id)
}

async function getRelatedMovies(id) {
    const {data} = await api(`/movie/${id}/recommendations`); 
    const movies = data.results;
    createMovies(movies,relatedMoviesContainer);
}


