import fetch from '../utils/fetch';
import homeUrl from '../config/server/home';

export default {
    loadTest() {
        return fetch(homeUrl.loadTest());
    }
};
