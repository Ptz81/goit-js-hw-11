//імпорт зовнішнього коду та бібліотек


// import './js/scroll';
import { PixabayApi } from './js/axios';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';



//знайти елементи
const form = document.querySelector('form');
// const input = document.querySelector('#search-bar');
const gallery = document.querySelector('.gallery');
const btnLoad = document.querySelector('.btnload');
btnLoad.style.display = 'none';

const lightBox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250
  });


const pixabayApi = new PixabayApi();

form.addEventListener('submit', handleFormSubmit);
btnLoad.addEventListener('click', handleLoadMore);


function createElements(items) {
  return items.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `<a href="${largeImageURL}" class="photo-link">
              <div class="photo-card">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                  <p class="info-item">
                    <b>Likes</b>
                    <span id="likes">${likes}</span>
                  </p>
                  <p class="info-item">
                    <b>Views</b>
                    <span id="views">${views}</span>
                  </p>
                  <p class="info-item">
                    <b>Comments</b>
                    <span id="comments">${comments}</span>
                  </p>
                  <p class="info-item">
                    <b>Downloads</b>
                    <span id="downloads">${downloads}</span>
                  </p>
                </div>
              </div>
            </a>`;
  }).join('');
}



async function handleFormSubmit(e) {
  e.preventDefault();
  const searchQuery = e.target.elements[0].value.trim();
  pixabayApi.q = searchQuery;
  let data;

  if (searchQuery == '') {

    return Notiflix.Notify.failure(
      'You did not make the request.'
    );
}

  try {
    data = await pixabayApi.fetchPhotos();
    Notiflix.Notify.success(`Hooray! We found something interesting.`);
  } catch (error) {
    console.error(error);
  }
  updateGallery(data);
}


function updateGallery(data) {
  if (!data.hits.length) {
     Notiflix.Notify.failure(
      'Sorry, there are no images matching on your request. Please try again.'
    );
    btnLoad.style.display = 'none';
    return;
  }
  gallery.insertAdjacentHTML('beforeend', createElements(data.hits));
  lightBox.refresh();

  if (data.totalHits <= pixabayApi.page * pixabayApi.pageDetection()) {
    btnLoad.style.display = 'none';
  } else {
    btnLoad.style.display = 'block';
  }
}

//------

async function handleLoadMore() {
  pixabayApi.page += 1;
  let data;
  try {
    data = await pixabayApi.fetchPhotos();
  } catch (error) {
     Notify.failure('Error! Something went wrong!');
    return;
  }
  updateGallery(data);




const newElements = createElements(data.results);
  gallery.insertAdjacentHTML('beforeend', newElements);
  lightBox.refresh();


  //------SCROLL-----//

//   const { height: cardHeight } = document
//     .querySelector(".gallery")
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: "smooth",
//   })
}
