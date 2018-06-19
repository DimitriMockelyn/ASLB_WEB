import application from 'focus-core/application';
import createRouter from 'focus-core/router';
import AgendaView from '../views/agenda';
import HistoriqueView from '../views/historique';
import userHelper from 'focus-core/user';
import {navigate} from 'focus-core/history';
import agendaService from '../services/agenda';
import moment from 'moment';

export default createRouter(Backbone).extend({
    log: true,
    beforeRoute() {
        application.changeRoute('agenda');
    },
    routes: {
        agenda: 'agenda',
        'agenda/:id/:week' : 'agendaId',
        'agenda/:id' : 'agendaIdOnly',
        historique: 'historique',
        historiqueAnimation: 'historiqueAnimation'
    },
    agenda() {
        this._pageContent(AgendaView);
    },
    agendaId(id, week) {
        navigate('agenda', false);
        this._pageContent(AgendaView, {props: {eventId: id, week: week}});
    },
    agendaIdOnly(id) {
        navigate('agenda', false);
        agendaService.loadEvent(id).then(res => {
            let mom = moment();
            let momentDebut = moment(res.date_debut, moment.ISO_8601);
            let diff = Math.abs(mom.clone().startOf('isoWeek').diff(momentDebut.clone().startOf('isoWeek'), 'week'));
            this._pageContent(AgendaView, {props: {eventId: id, week: diff}});
        });
        
    },
    historique() {
        this._pageContent(HistoriqueView);
    },
    historiqueAnimation() {
        this._pageContent(HistoriqueView, {props: {animation: true}});
    }
});

