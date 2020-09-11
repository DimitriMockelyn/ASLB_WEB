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
    loadMachines() {
        return fetch(homeUrl.loadMachines());
    },
    loadActivites() {
        return fetch(homeUrl.loadActivites());
    },
    loadPresentations() {
        return fetch(homeUrl.loadPresentations());
    },
    loadChat() {
        return fetch(homeUrl.loadChat());
    },
    createActivityInCreneau(data) {
        return fetch(homeUrl.createActivityInCreneau({urlData: {id: data._id}, data: data}), utils.computeHeaders());
    },
    addMessageChat(data) {
        return fetch(homeUrl.addMessageChat({data}), utils.computeHeaders());
    },
    loadBlocs(type) {
        return fetch(homeUrl.loadBlocs({urlData: {type}})).then(res => {
            res.map(value => {
                value.contenu = value.contenu.replace(/href=".*" target=\"_blank\"/g, function (str) {

                    let url = str.replace(/href="/g,"").replace(/".*/g,"");
                    return 'href='+window.location.hash+' target="_blank" onclick="window.location.href=\''+url+'\'"';
                })
            });
            return res;
        })
    },
    loadDayOffs(type) {
        return fetch(homeUrl.loadDayOffs({urlData: {type}}));
    },
    loadActivityTimes() {
        return fetch(homeUrl.loadActivityTimes());
    },
    loadMachinesForDay(data) {
        return fetch(homeUrl.loadMachinesForDay({data}));
    },
    loadActivitesForDay(data) {
        return fetch(homeUrl.loadActivitesForDay({data}));
    },
    toggleSelfForMachine(id) {
        return fetch(homeUrl.toggleSelfForMachine({urlData: {id}, data: {test: true}}), utils.computeHeaders());
    },
    loadContributeurs() {
        return fetch(homeUrl.loadContributeurs());
    },
    loadContributeursInfo(login) {
        return fetch(homeUrl.loadContributeursInfo({urlData: {login}}));
    }
};
