import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

refs = {
  form: document.querySelector('#search-form'),
  galleryDiv: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.loadMoreBtn.classList.add('is-hidden');

let pageCount = 1;

axios.defaults.baseURL = 'https://pixabay.com/api/';

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadBtnClick);

async function onLoadBtnClick() {
  pageCount += 1;

  const searchQuery = refs.form.elements.searchQuery.value;

  const answer = await getImages(searchQuery);

  refs.galleryDiv.insertAdjacentHTML('beforeend', renderGallery(answer));

}

async function onSearch(e) {
  e.preventDefault();

  refs.galleryDiv.innerHTML = '';

  const searchQuery = e.currentTarget.elements.searchQuery.value;
  const answer = await getImages(searchQuery);

  refs.galleryDiv.insertAdjacentHTML('beforeend', renderGallery(answer));
}

function renderGallery(images) {
  const result =
  images.map(
    image =>
      `<div class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy"/>
        <div class="info">
          <p class="info-item">
            <b>Likes ${image.likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${image.views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${image.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${image.downloads}</b>
          </p>
        </div>
      </div>`
    ).join('');
  return result;

}

async function getImages(query) {
  try {
    const response = await axios.get(``, {
      params: {
        key: '32728166-633f0618a41e9b54facc5024e',
        q: `${query}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: pageCount,
        per_page: 40,
      },
    });
    console.log(response);
    
    if (response.data.hits.length === 0) {
      throw new Error('404');
    } else if (response.data.hits.length < 40) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtn.classList.add('is-hidden');
    } else {
      refs.loadMoreBtn.classList.remove('is-hidden');
      Notify.success('good');
    }

    return response.data.hits

  } catch (error) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
  }
}



