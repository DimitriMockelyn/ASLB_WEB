import builder from 'focus-core/util/url/builder';
import {getConfig} from '../../config';
const url = getConfig().API_ROOT;


export default {
    loadAll:  builder(url + 'evenements', 'GET'),
    loadAllWeek: builder(url + 'evenementsWeek/${numWeek}', 'GET'),
    loadIncoming:  builder(url + 'evenements/next', 'GET'),
    loadMine:  builder(url + 'myEvenements', 'GET'),
    loadMineWeek:  builder(url + 'myEvenementsWeek/${numWeek}', 'GET'),
    addSelfToEvent: builder(url + 'evenements/addSelf/${eventId}', 'POST'),
    removeSelfToEvent: builder(url + 'evenements/removeSelf/${eventId}', 'POST'),
    generateAppointment: builder(url + 'evenements/generateAppointment/${eventId}', 'POST'),
    sendMailAppointment: builder(url + 'evenements/sendMailAppointment/${eventId}', 'POST'),
    deleteEvent: builder(url + 'evenements/${eventId}', 'DELETE'),
    loadEvent: builder(url + 'evenements/${eventId}', 'GET'),
    createEvent: builder(url + 'evenements', 'POST'),
    updateEvent: builder(url + 'evenements/${eventId}', 'PUT'),
    loadTypeEvenements: builder(url + 'typeEvenements', 'GET'),
    loadNiveauEvenements: builder(url + 'niveauEvenements', 'GET'),
    loadMyHistory:  builder(url + 'evenements/history', 'GET'),
    loadCommentaire: builder(url + 'commentaire/${eventId}', 'GET'),
    postCommentaire: builder(url + 'commentaire/${eventId}', 'POST'),
    postReponseCommentaire: builder(url + 'reponseCommentaire/${eventId}', 'POST'),
    isCoach: builder(url + 'isCoach', 'GET'),
    loadMyCoachingHistory: builder(url + 'coachHistory', 'GET'),
    loadTokens: builder(url + 'loadTokens', 'GET'),
    loadAbsents: builder(url + 'loadAbsents/${eventId}', 'GET'),
    setAbsent: builder(url + 'setAbsent/${eventId}', 'POST'),
    setPresent: builder(url + 'setPresent/${eventId}', 'POST'),
    exportMyHistory: builder(url + 'historique/exportMyHistory', 'POST'),
    exportMyCoachHistory: builder(url + 'historique/exportMyCoachHistory', 'POST'),
    sendPostNotif: builder(url + 'sendPostNotif/${eventId}', 'POST')
};
