searchFormBtn.addEventListener('click', () => {
    location.hash = '#search=' + searchFormInput.value;
    
});

trendingBtn.addEventListener('click', () => {
    location.hash = '#trends';
});

arrowBtn.addEventListener('click', () => {
    location.hash = window.history.back();
 });

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);


function navigator() {
    location.hash.startsWith('#trends')
    ?   trendsPage()
    :   location.hash.startsWith('#search')
    ?    searchPage()
    :   location.hash.startsWith('#movie')
    ?    moviePage()
    :   location.hash.startsWith('#category')
    ?    categoryPage()
    :   homePage()

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}
  
function homePage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getCategoriesPreview();
    getTrendingMoviesPreview();
}

function trendsPage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Tendencias'
    getTrendingMovies();
}

function searchPage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_,query] = location.hash.split('=');
    getMoviesBySearch(query);
}

function moviePage() {
    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    const [_,movieId] = location.hash.split('=');
    getMovieById(movieId);
}

function categoryPage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_,categoryData] = location.hash.split('=');
    const [categoryId, categoryName] = categoryData.split('-');
    headerCategoryTitle.innerHTML = decodeURIComponent(categoryName);
    getMoviesByCategory(categoryId);
}