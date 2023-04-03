import { PixabayAPI } from "./pixabay_api";
import Notiflix from "notiflix";
import createPhotoGallery from '../templates/image-card.hbs';

const pixabayApi = new PixabayAPI();
const PER_PAGE = 40;

const elSearchForm = document.querySelector("#search-form");
const elGallery = document.querySelector(".gallery");
const elLoadMoreBtn = document.querySelector(".load-more__button");

const handleFormSubmit = async ev => {
  ev.preventDefault();

  const searchQuery = ev.currentTarget.elements['searchQuery'].value.trim();

  elGallery.innerHTML = "";
  
  if (searchQuery === "") {
    elSearchForm.reset();
    return;
  }

  pixabayApi.page = 1;
  pixabayApi.per_page = PER_PAGE;
  pixabayApi.query = searchQuery;

  try {
    const { data } = await pixabayApi.fetchPhotos();

    console.log(data);

    if (!data.total) {
      Notiflix.Notify.failure("Images not found");
      elSearchForm.reset();
      return;
    }

    Notiflix.Notify.success(`Found ${data.totalHits} images`);

    elGallery.innerHTML = createPhotoGallery(data.hits);
    if (data.totalHits < PER_PAGE) {
      elLoadMoreBtn.classList.add('is-hidden');
    }
    else {
      elLoadMoreBtn.classList.remove('is-hidden');
    }

  } catch (err) {
    console.log(err);
  }
};

const handleLoadMoreBtnClick = async () => {
  pixabayApi.page += 1;

  try {
    const { data } = await pixabayApi.fetchPhotos();

    if (data.hits.length < PER_PAGE) {
      elLoadMoreBtn.classList.add('is-hidden');
    }

    elGallery.insertAdjacentHTML(
      'beforeend',
      createPhotoGallery(data.hits)
    );
  } catch (err) {
    console.log(err);
  }
};

elSearchForm.addEventListener("submit", handleFormSubmit);
elLoadMoreBtn.addEventListener("click", handleLoadMoreBtnClick);
