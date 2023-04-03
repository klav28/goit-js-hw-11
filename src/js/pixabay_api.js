import axios from 'axios';

export class PixabayAPI {
    #BASE_URL = 'https://pixabay.com';
    #API_KEY = '10882188-26ad39db776bf4c57afd40242';
    page = 1;
    per_page = 20;
    query = null;

    async fetchPhotos() {
        try {
            return await axios.get(`${this.#BASE_URL}/api/`, { 
                params: {
                    key: this.#API_KEY,
                    q: this.query,
                    image_type: 'photo',
                    orientation: 'horizontal',
                    safesearch: true,
                    page: this.page,
                    per_page: this.per_page,
                }
                });
        } catch (error) {
            throw new Error(error.message);
        }
    }
}