import axios from 'axios';

export class PixabayAPI {
  #API_KEY = '38645288-6d1a7288dfdea742a00b25c17';
  #BASE_URL = 'https://pixabay.com/api/';

  page = 1;
  q = null;
  per_page = 40;


  fetchPhotos() {
    const searchParams = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      client_id: this.#API_KEY,
      q: this.q,
      page: this.page,
      per_page: this.per_page,
    });

    return axios.get(
      `${this.#BASE_URL}?key=${this.#API_KEY}&q=${searchParams}` );
  }
  resetPage() {
    this.page = 1;
  }
}
