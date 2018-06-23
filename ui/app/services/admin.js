import fetch from '../utils/fetch';
import adminUrl from '../config/server/admin';
import utils from './utils';

export default {
    createNews(data) {
        return fetch(adminUrl.createNews({data}), utils.computeHeaders());
    },
    loadAllNews() {
        return fetch(adminUrl.loadAllNews(), utils.computeHeaders());
    },
    editNews(data) {
        return fetch(adminUrl.editNews({urlData: {id: data.id}, data: data}), utils.computeHeaders());
    },
    deleteNews(data) {
        return fetch(adminUrl.deleteNews({urlData: {id: data.id}}), utils.computeHeaders());
    },
    loadAllUsers(data) {
        return fetch(adminUrl.loadAllUsers({data}), utils.computeHeaders());
    },
    exportAllUsers(data) {
        return fetch(adminUrl.exportAllUsers({data}), utils.computeHeaders());
    },
    exportAllEvents(data) {
        return fetch(adminUrl.exportAllEvents({data}), utils.computeHeaders());
    },
    canCreateToggle(data) {
        return fetch(adminUrl.canCreateToggle({urlData: {id: data.id}}), utils.computeHeaders());
    },
    toggleAdmin(data) {
        return fetch(adminUrl.toggleAdmin({urlData: {id: data.id}}), utils.computeHeaders());
    },
    toggleActif(data) {
        return fetch(adminUrl.toggleActif({urlData: {id: data.id}, data: data}), utils.computeHeaders());
    },
    updateUser(data) {
        return fetch(adminUrl.updateUser({urlData: {id: data.id}, data: data}), utils.computeHeaders());
    },
    editPartenaire(data) {
        return fetch(adminUrl.editPartenaire({urlData: {id: data.id}, data: data}), utils.computeHeaders());
    },
    deletePartenaire(data) {
        return fetch(adminUrl.deletePartenaire({urlData: {id: data.id}}), utils.computeHeaders());
    },
    createPartenaire(data) {
        return fetch(adminUrl.createPartenaire({data}), utils.computeHeaders());
    },
    loadUsersForMail() {
        return fetch(adminUrl.loadUsersForMail(), utils.computeHeaders());
    },
    editPresentation(data) {
        return fetch(adminUrl.editPresentation({urlData: {id: data.id}, data: data}), utils.computeHeaders());
    },
    deletePresentation(data) {
        return fetch(adminUrl.deletePresentation({urlData: {id: data.id}}), utils.computeHeaders());
    },
    createPresentation(data) {
        return fetch(adminUrl.createPresentation({data}), utils.computeHeaders());
    },
    editTypeEvenement(data) {
        return fetch(adminUrl.editTypeEvenement({urlData: {id: data.id}, data: data}), utils.computeHeaders());
    },
    deleteTypeEvenement(data) {
        return fetch(adminUrl.deleteTypeEvenement({urlData: {id: data.id}}), utils.computeHeaders());
    },
    createTypeEvenement(data) {
        return fetch(adminUrl.createTypeEvenement({data}), utils.computeHeaders());
    },
    loadAllRibbons() {
        return fetch(adminUrl.loadAllRibbons(), utils.computeHeaders());
    },
    editRibbon(data) {
        return fetch(adminUrl.editRibbon({urlData: {id: data.id}, data: data}), utils.computeHeaders());
    },
    deleteRibbon(data) {
        return fetch(adminUrl.deleteRibbon({urlData: {id: data.id}}), utils.computeHeaders());
    },
    createRibbon(data) {
        return fetch(adminUrl.createRibbon({data}), utils.computeHeaders());
    },
    loadUserRibbons(id) {
        return fetch(adminUrl.loadUserRibbons({urlData: {id: id}}), utils.computeHeaders());
    },
    toggleRibbon(data) {
        return fetch(adminUrl.toggleRibbon({urlData: data}), utils.computeHeaders());
    },
    toggleActiveRibbon(data) {
        return fetch(adminUrl.toggleActiveRibbon({urlData: data}), utils.computeHeaders());
    },
    allBlocs() {
        return fetch(adminUrl.allBlocs(), utils.computeHeaders());
    },
    saveBloc(data) {
        return fetch(adminUrl.saveBloc({urlData: {id: data._id}, data: data}), utils.computeHeaders());
    },
    editMedia(data) {
        return fetch(adminUrl.editMedia({urlData: {id: data.id}, data: data}), utils.computeHeaders());
    },
    deleteMedia(data) {
        return fetch(adminUrl.deleteMedia({urlData: {id: data.id}}), utils.computeHeaders());
    },
    createMedia(data) {
        return fetch(adminUrl.createMedia({data}), utils.computeHeaders());
    },
    toggleChat(data) {
        return fetch(adminUrl.toggleChat({urlData: {id: data._id}}), utils.computeHeaders());
    },
};
