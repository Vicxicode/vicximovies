const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
        "language": navigator.language || "es-ES"
    }
});

function likedMovieList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;
    if (item) {
        movies = item;
    } else {
        movies = {};
    }
    return movies;
}

function likedMovie(movie) {
    const likedMovies = likedMovieList();
    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    }
    localStorage.setItem('liked_movies',JSON.stringify(likedMovies));
    if (location.hash == ''){
        location.reload();
    }
}

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url)
        }
    })
});

function createMovies(movies, container, {lazyLoad = false, clean = true}={}) {
    if (clean) {
        container.innerHTML = '';
    }

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt',movie.title);
        movieImg.setAttribute(lazyLoad ? 'data-img' : 'src','https://image.tmdb.org/t/p/w300' + movie.poster_path)
        
        movieImg.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        })

        movieImg.addEventListener('error', () => {
            movieImg.setAttribute('src', '../styles/vicxi.png')
        });

        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        likedMovieList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked');
            likedMovie(movie);
        })
        
        if (lazyLoad) {
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
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
    createMovies(movies,trendingMoviesPreviewList,true);
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
    maxPage = data.total_pages;
    createMovies(movies,genericSection, {lazyLoad : true});
}

function getPaginationId(id) {
    return async function () {
        const { scrollTop, scrollHeight, clientHeight} = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight -15);
        const pageIsNotMax = page < maxPage; 
        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const {data} = await api('/discover/movie', {
                params: {
                    with_genres: id,
                    page
                }
            }); 
            const movies = data.results;
            createMovies(movies,genericSection,{lazyLoad : true, clean: false});
        }
    }
}

async function getMoviesBySearch(query) {
    const {data} = await api('/search/movie', {
        params: {
            query
        }
    }); 
    const movies = data.results;
    maxPage = data.total_pages;
    createMovies(movies,genericSection);
}

function getPaginationSearch(query) {
    return async function () {
        const { scrollTop, scrollHeight, clientHeight} = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight -15);
        const pageIsNotMax = page < maxPage; 
        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const {data} = await api('/search/movie', {
                params: {
                    query,
                    page,
                }
            }); 
            const movies = data.results;
            createMovies(movies,genericSection,{lazyLoad : true, clean: false});
        }
    }
}

async function getTrendingMovies() {
    const {data} = await api('/trending/movie/day'); 
    const movies = data.results;
    maxPage = data.total_pages;
    createMovies(movies,genericSection,{lazyLoad : true, clean: true});
}

async function getPagination() {
    const { scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight -15);
    const pageIsNotMax = page < maxPage;
    if (scrollIsBottom && pageIsNotMax) {
        page++;
        const {data} = await api('/trending/movie/day', {
            params: {
                page
            }
        }); 
        const movies = data.results;
        createMovies(movies,genericSection,{lazyLoad : true, clean: false});
    }
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

function getLikedMovies() {
    const likedMovies = likedMovieList();
    const moviesArray = Object.values(likedMovies);
    !moviesArray.length && likedMoviesSection.classList.add('inactive');
    createMovies(moviesArray,likedMoviesListArticle,{lazyLoad : true, clean: true})
}
