import fetch from '../utils/fetch';
import homeUrl from '../config/server/home';
import utils from './utils';

export default {
    loadPartenaires() {
        return fetch(homeUrl.loadPartenaires());
    },
    loadPresentations() {
        return fetch(homeUrl.loadPresentations());
    },
    loadChat() {
        return fetch(homeUrl.loadChat());
    },
    addMessageChat(data) {
        return fetch(homeUrl.addMessageChat({data}), utils.computeHeaders());
    },
    loadBlocs(type) {
        return fetch(homeUrl.loadBlocs({urlData: {type}}));
    }
};
