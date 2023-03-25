
export class PixabayApi {
  #BASE_URL = 'https://pixabay.com/api/';

  #BASE_SEARCH_PARAMS = {
    key_access: '12470042-156b4534868fdb2d637b9b4f4',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 40,
  }
  q = '';
  page = 1;


  async fetchPhotos() {
    const searchParams = new URLSearchParams({
      ...this.#BASE_SEARCH_PARAMS,
      q: this.q,
      page: this.page,

    });
   const { data } = await axios.get(`${this.#BASE_URL}?${searchParams}`);
        return data;
  }
}


