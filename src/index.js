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
// const resetBtn = document.querySelector('.btn-clear');
const gallery = document.querySelector('.gallery');
const btnLoad = document.querySelector('.btnload');
btnLoad.style.display = 'none';

const lightBox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250
  });

let data;
const pixabayApi = new PixabayApi();

form.addEventListener('submit', handleFormSubmit);
btnLoad.addEventListener('click', handleLoadMore);
// resetBtn.addEventListener('click', handleReset);


//формування розмітки по запиту

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

//асинхронна функція на submit

async function handleFormSubmit(e) {
  e.preventDefault(); //щоб сторінка не перевантажувалась
  const searchQuery = e.target.elements['search-bar'].value.trim(); //значення інпут записуємо у змінну

  //перевіряємо чи не пустий рядок
  if (searchQuery === '') {
    gallery.innerHTML = '';
    btnLoad.style.display = 'none';
    return Notiflix.Notify.failure(
      'Please, enter your request.'
    );
  }

  //значення інпуту записуємо у значення запиту через клас
  pixabayApi.q = searchQuery;
  try {
    //очистимо рядок
    gallery.innerHTML = '';

    //завантажимо фото
   const data = await pixabayApi.fetchPhotos();

// оновимо  розмітку
    updateGallery(data);

    // Notiflix.Notify.success(`Hooray! We found something interesting.`);


    // очистимо пошук
    e.target.elements['search-bar'].value = '';
  } catch (error) {
    Notiflix.Notify.failure('Something went wrong! An error!');
  }


}



//функція на перевірку даних та оновлення галереї

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
    Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
  } else {
    btnLoad.style.display = 'block';
    Notiflix.Notify.success(`'Hooray! We found ${data.totalHits} images.'`);
  }

}

//------

async function handleLoadMore() {
  pixabayApi.page += 1;
  // let data;
  try {
   const data = await pixabayApi.fetchPhotos();
updateGallery(data);
  } catch (error) {
     Notify.failure('Error! Something went wrong!');
    return;
  }


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



// function handleReset() {
//   form.reset();
//   gallery.innerHTML = '';
//   btnLoad.style.display = 'none';
// }