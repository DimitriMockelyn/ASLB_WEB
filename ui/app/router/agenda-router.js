import application from 'focus-core/application';
import createRouter from 'focus-core/router';
import AgendaView from '../views/agenda';
import HistoriqueView from '../views/historique';
import userHelper from 'focus-core/user';
import {navigate} from 'focus-core/history';
export default createRouter(Backbone).extend({
    log: true,
    beforeRoute() {
        application.changeRoute('agenda');
    },
    routes: {
        agenda: 'agenda',
        'agenda/:id' : 'agendaId',
        historique: 'historique',
        historiqueAnimation: 'historiqueAnimation'
    },
    agenda() {
        this._pageContent(AgendaView);
    },
    agendaId(id) {
        navigate('agenda', false);
        this._pageContent(AgendaView, {props: {eventId: id}});
    },
    historique() {
        this._pageContent(HistoriqueView);
    },
    historiqueAnimation() {
        this._pageContent(HistoriqueView, {props: {animation: true}});
    }
});

