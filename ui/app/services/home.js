import fetch from '../utils/fetch';
import homeUrl from '../config/server/home';
import utils from './utils';

export default {
    loadPartenaires() {
        return fetch(homeUrl.loadPartenaires());
    },
    loadMedias() {
        return fetch(homeUrl.loadMedias());
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
    },
    loadMachinesForDay(data) {
        return fetch(homeUrl.loadMachinesForDay({data}));
    },
    toggleSelfForMachine(id) {
        return fetch(homeUrl.toggleSelfForMachine({urlData: {id}, data: {}}), utils.computeHeaders());
    }
};
