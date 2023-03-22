//імпорт зовнішнього коду та бібліотек

import './js/visual';
// import './js/scroll';
import { getUserData } from './js/axios';

import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';


import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import axios from 'axios';


const DEBOUNCE_DELAY = 300;

//знайти елементи
const form = document.querySelector('form');
const input = document.querySelector('#search-bar');
const gallery = document.querySelector('.gallery');
const btnLoad = document.querySelector('.btnload')
btnLoad.style.display = 'none';

let page = 1;

//---------------------------------------------//

input.addEventListener('input', debounce(handlerPhotoSearch, DEBOUNCE_DELAY, { trailing: true }))
form.addEventListener('submit', handleFormSubmit);
btnLoad.addEventListener('click', handlerBtnLoad);

//---------------------INPUT------------------//

//функція на введення в input із debounce без перезавантаження
function handlerPhotoSearch(e) {
  e.preventDefault();

  //у місці введення беремо дані
  const searchedPhoto = e.target.value.trim();

  //якщо порожня стрічка виводимо повідомлення
  if (searchedPhoto!=='') {
    return;
  }

}
//-------------------------------------------------//

//функція на сабміт - забороняє перевантажувати сторінку, контроль введених даних
  function handleFormSubmit(e) {
    e.preventDefault();
    page = 1;
    gallery.innerHTML = '';

    const formData = input.value.trim();

    if (formData!=='') {
      getUser(formData);
    } else {
      btnLoad.style.display = 'none';
    }
    return Notiflix.Notify.failure(
      'Sorry, No found images. Please try again.'
    );
  }

//--------------------------------------------------//

 function handlerBtnLoad (e) {
  e.preventDefault();
  const formData = input.value.trim();
  page++;
  getUser(formData, page);
}

//-------------------------------------------------//

//стягуємо дані з pixabay
async function getUser(formData, page) {

    try {
      const response = await axios.get(`https://pixabay.com/api/?key=12470042-156b4534868fdb2d637b9b4f4&q=${formData}&image_type=photo&orientation=horizontal&safesearch=true`);
      createElem(response.data);
    } catch (error) {
      console.error(error);
    }


  //функція, що викликається на створення картки
  function createElem(items) {

    return items
      .map(({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads
      }) => {
      return `<a href='${largeImageURL}' class="photo-link">
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
    })
      .join("");
  }

  const lightBox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250
  });

  //створення картки
  const newElement = createElem(item);
  gallery.insertAdjacentHTML('beforeend', newElement);
  lightBox.refresh();







  // const fetchPostsBtn = document.querySelector(".btn");



  // // const userList = document.querySelector(".posts");
  // const alertPopup = document.querySelector(".alert");
  // let isAlertVisible = false;

  // // Controls the group number
  // let page = 1;
  // // Controls the number of items in the group
  // let limit = 5;
  // // In our case total number of pages is calculated on frontend
  // const totalPages = 100 / limit;

  // fetchPostsBtn.addEventListener("click", () => {
  //   // Check the end of the collection to display an alert
  //   if (page > totalPages) {
  //     return toggleAlertPopup();
  //   }

  //   fetchPosts()
  //     .then((posts) => {
  //       renderPosts(posts);
  //       // Increase the group number
  //       page += 1;

  //       // Replace button text after first request
  //       if (page > 1) {
  //         fetchPostsBtn.textContent = "Load more";
  //       }
  //     })
  //     .catch((error) => console.log(error));
  // });

  // function fetchPosts() {
  //   const params = new URLSearchParams({
  //     _limit: limit,
  //     _page: page
  //   });

  //   return fetch(`https://pixabay.com/api/?key12470042-156b4534868fdb2d637b9b4f4&q={inputValue}&image_type=photo&orientation=horizontal&safesearch=true`).then(
  //     (response) => {
  //       if (!response.ok) {
  //         throw new Error(response.status);
  //       }
  //       return response.json();
  //     }
  //   );
  // }



  // function toggleAlertPopup() {
  //   if (isAlertVisible) {
  //     return;
  //   }
  //   isAlertVisible = true;
  //   alertPopup.classList.add("is-visible");
  //   setTimeout(() => {
  //     alertPopup.classList.remove("is-visible");
  //     isAlertVisible = false;
  //   }, 3000);
  // }





  // const { height: cardHeight } = document
  //   .querySelector(".gallery")
  //   .firstElementChild.getBoundingClientRect();

  // window.scrollBy({
  //   top: cardHeight * 2,
  //   behavior: "smooth",
  // })
}