import { PixabayAPI } from "./pixabay_api";
import Notiflix from "notiflix";
import Handlebars from "handlebars";

const pixabayApi = new PixabayAPI();

const elSearchForm = document.querySelector("#search-form");
const elGallery = document.querySelector(".gallery");
const elLoadMoreBtn = document.querySelector(".load-more__button");

const handleFormSubmit = async ev => {
  ev.preventDefault();

  const searchQuery = ev.currentTarget.elements['searchQuery'].value;
  pixabayApi.page = 1;
  pixabayApi.query = searchQuery;

  try {
    const { data } = await pixabayApi.fetchPhotos();

console.log(data);

    if (!data.total) {
      Notiflix.Notify.failure("Images not found");
      return;
    }

    Notiflix.Notify.success(`Found ${data.totalHits} images`);

    elGallery.innerHTML = renderGalleryImage(data.hits);

    // loadMoreBtnEl.classList.remove('is-hidden');

  } catch (err) {
    console.log(err);
  }
};

function renderGalleryImage(images) {
  return images.reduce ((acc, image) => {
    return acc + `<li>
    <img src="${image.webformatURL}" alt="${image.tags}" class="photocard__img" loading="lazy" width="360px"/>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
      </p>
      <p class="info-item">
        <b>Views</b>
      </p>
      <p class="info-item">
        <b>Comments</b>
      </p>
      <p class="info-item">
        <b>Downloads</b>
      </p>
    </div>
  </li>`
  }, "");
}

const handleLoadMoreBtnClick = async () => {
  pixabayApi.page += 1;

  try {
    const { data } = await pixabayApi.fetchPhotos();

    // if (pixabayApi.page === data.total_pages) {
    //   loadMoreBtnEl.classList.add('is-hidden');
    // }

    elGallery.insertAdjacentHTML(
      'beforeend',
      renderGalleryImage(data.hits)
    );
  } catch (err) {
    console.log(err);
  }
};


elSearchForm.addEventListener("submit", handleFormSubmit);
elLoadMoreBtn.addEventListener("click", handleLoadMoreBtnClick);
