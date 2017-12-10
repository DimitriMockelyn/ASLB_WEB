import fetch from '../utils/fetch';
import homeUrl from '../config/server/home';

export default {
    loadPartenaires() {
        return fetch(homeUrl.loadPartenaires());
    },
    loadPresentations() {
        return fetch(homeUrl.loadPresentations());
    },
};
