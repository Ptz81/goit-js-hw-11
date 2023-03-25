//імпорт зовнішнього коду та бібліотек

// import './js/visual';
// import './js/scroll';
import { PixabayApi } from './js/axios';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';



//знайти елементи
const form = document.querySelector('form');
const input = document.querySelector('#search-bar');
const gallery = document.querySelector('.gallery');
const btnLoad = document.querySelector('.btnload');
btnLoad.style.display = 'none';

const lightBox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250
  });

const DEBOUNCE_DELAY = 300;
const pixabayApi = new PixabayApi();



input.addEventListener('input', debounce(handlePhotoSearch, DEBOUNCE_DELAY, { trailing: true }));
form.addEventListener('submit', handleFormSubmit);
btnLoad.addEventListener('click', handleLoadMore);


//функція на введення в input із debounce без перезавантаження
function handlePhotoSearch(e) {
  e.preventDefault();
  const searchedPhoto = e.target.value.trim();
  if (searchedPhoto === '') {
    return;
  }
}

//-------------------------------------------------//

//функція на сабміт - забороняє перевантажувати сторінку, контроль введених даних
// async function handleFormSubmit(e) {
//   e.preventDefault();
//   const searchQuery = e.target.elements[0].value.trim()
//   pixabayApi.q = searchQuery;
//   pixabayApi.fetchPhotos().then(
//     data => {
//       if (!data.results.length) {
//         throw new Error();
//       }
//       gallery.innerHTML = createElem(data.results);

//       if (data.total_pages === pixabayApi.page) {
//         return;
//       }

//       btnLoad.classList.remove('is-hidden')
//     })
//     .catch(() => {
//       btnLoad.classList.add('is-hidden');
//       gallery.textContent = 'Images not found';
//     });
// async function handleFormSubmit(e) {
//   e.preventDefault();
//   const searchQuery = e.target.elements[0].value.trim()
//   pixabayApi.q = searchQuery;
//   let data;
//   try {
//     data = await pixabayApi.fetchPhotos();
//   } catch (error) {
//     console.error(error);
//   }
//   if (!data.results.length) {
//     gallery.textContent = 'Images not found';
//     btnLoad.classList.add('is-hidden');
//     return;
//   }
//   gallery.innerHTML = createElem(data.results);

//   if (data.total_pages === pixabayApi.page) {
//     btnLoad.classList.add('is-hidden');
//     return;
//   }
//   btnLoad.classList.remove('is-hidden')
// }

async function handleFormSubmit(e) {
  e.preventDefault();
  const searchQuery = e.target.elements[0].value.trim();
  pixabayApi.q = searchQuery;
  let data;
  try {
    data = await pixabayApi.fetchPhotos();
  } catch (error) {
    console.error(error);
  }
  updateGallery(data);
}

function updateGallery(data) {
  if (!data.results.length) {
    gallery.textContent = 'Images not found';
    btnLoad.classList.add('is-hidden');
    return;
  }
  gallery.innerHTML = createElements(data.results);

  if (data.total_pages === pixabayApi.page) {
    btnLoad.classList.add('is-hidden');
    return;
  }
  btnLoad.classList.remove('is-hidden');
}

  //   const formData = input.value.trim();

  //   if (formData!=='') {
  //     getUser(formData);
  //   } else {
  //     btnLoad.style.display = 'none';
  //   }
  //   return Notiflix.Notify.failure(
  //     'Sorry, No found images. Please try again.'
  //   );
  // }

  //--------------------------------------------------//

//   const handleLoadMore = async function(){
//     pixabayApi.page += 1;

//     {
//       const { picture } = await pixabayApi.fetchPhotos();

//       gallery.insertAdjacentHTML('beforeend', createElem(picture));

//       if (pixabayApi.page === data.total_pages){
//       btnLoad.classList.add('is-hidden');
//       }
//     }
//   };



const handleLoadMore = async function() {
  pixabayApi.page += 1;

  try {
    const data = await pixabayApi.fetchPhotos();
    gallery.insertAdjacentHTML('beforeend', createElem(data.results));
    if (pixabayApi.page === data.total_pages) {
      btnLoad.classList.add('is-hidden');
    }
  } catch (error) {
    console.error(error);
  }
};

    //--------------------------------------------------//

//  function handlerBtnLoad (e) {
//   e.preventDefault();
//   const formData = input.value.trim();
//   page++;
//   getUser(formData, page);
// }

//-------------------------------------------------//

//стягуємо дані з pixabay
// async function getUser(formData, page) {

//     try {
//       const response = await axios.get(`https://pixabay.com/api/?key=12470042-156b4534868fdb2d637b9b4f4&q=${formData}&image_type=photo&orientation=horizontal&safesearch=true`);
//       createElem(response.data);
//     } catch (error) {
//       console.error(error);
//     }


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



  //створення картки
  const newElement = createElem(data);
  gallery.insertAdjacentHTML('beforeend', newElement);
  lightBox.refresh();


  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  })




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






// }