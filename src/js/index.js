import { PixabayAPI } from './pixabay-api';
import { createGallery } from './gallery';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const searchFormEl = document.querySelector('form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});


const pixabayApiInstance = new PixabayAPI();
// console.log(pixabayApiInstance);
loadMoreBtnEl.style.display = 'none';

const handleSearchFormSubmit = async event => {
  try {
    event.preventDefault();

    const searchQuery = searchFormEl.firstElementChild.value.trim();
    console.log(searchQuery);

    pixabayApiInstance.resetPage();
    if (!searchQuery) {
      return;
    }
    pixabayApiInstance.q = searchQuery;

    const { data } = await pixabayApiInstance.fetchPhotos();
    console.log(data);

    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtnEl.style.display = 'none';
    } else {
      galleryListEl.innerHTML = createGallery(data.hits);
      lightbox.refresh();

      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

      
      if (data.totalHits < pixabayApiInstance.page * 40)
      {
        galleryListEl.insertAdjacentHTML(
          'beforeend',
          '<div><p>We\'re sorry, but you\'ve reached the end of search results.</p></div>'
        );
        loadMoreBtnEl.style.display = 'none'; 
      } else {
        loadMoreBtnEl.style.display = 'block';
      }
    }
  } catch (error) {
    console.warn(error);
  }
};

const handleLoadMoreBtnClick = async () => {
  try {
    pixabayApiInstance.page += 1;
    const { data } = await pixabayApiInstance.fetchPhotos();

    galleryListEl.insertAdjacentHTML('beforeend', createGallery(data.hits));
    lightbox.refresh();

   
    if (
      data.totalHits <=
      pixabayApiInstance.page * pixabayApiInstance.per_page
    ) {
      galleryListEl.insertAdjacentHTML(
        'beforeend',
        "<div><p>We're sorry, but you've reached the end of search results.</p></div>"
      );

      loadMoreBtnEl.style.display = 'none'; 
    } else {
      loadMoreBtnEl.style.display = 'block'; 
    }

   
    const { height: cardHeight } = galleryListEl.lastElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight,
      behavior: 'smooth',
    });

  } catch (error) {
    console.warn(error);
  }
};

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);

