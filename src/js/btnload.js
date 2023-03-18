const fetchPostsBtn = document.querySelector(".btn");



// const userList = document.querySelector(".posts");
const alertPopup = document.querySelector(".alert");
let isAlertVisible = false;

// Controls the group number
let page = 1;
// Controls the number of items in the group
let limit = 5;
// In our case total number of pages is calculated on frontend
const totalPages = 100 / limit;

fetchPostsBtn.addEventListener("click", () => {
  // Check the end of the collection to display an alert
  if (page > totalPages) {
    return toggleAlertPopup();
  }

  fetchPosts()
    .then((posts) => {
      renderPosts(posts);
      // Increase the group number
      page += 1;

      // Replace button text after first request
      if (page > 1) {
        fetchPostsBtn.textContent = "Load more";
      }
    })
    .catch((error) => console.log(error));
});

function fetchPosts() {
  const params = new URLSearchParams({
    _limit: limit,
    _page: page
  });

  return fetch(`https://pixabay.com/api/?key12470042-156b4534868fdb2d637b9b4f4&q={inputValue}&image_type=photo&orientation=horizontal&safesearch=true`).then(
    (response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    }
  );
}

function renderPosts(posts) {
  const markup = posts
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
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
</div>`;
    })
    .join("");
  userList.insertAdjacentHTML("beforeend", markup);
}

function toggleAlertPopup() {
  if (isAlertVisible) {
    return;
  }
  isAlertVisible = true;
  alertPopup.classList.add("is-visible");
  setTimeout(() => {
    alertPopup.classList.remove("is-visible");
    isAlertVisible = false;
  }, 3000);
}