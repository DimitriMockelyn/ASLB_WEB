import application from 'focus-core/application';
import createRouter from 'focus-core/router';
import AgendaView from '../views/agenda';
import HistoriqueView from '../views/historique';
import userHelper from 'focus-core/user';
import history from 'focus-core/history';
export default createRouter(Backbone).extend({
    log: true,
    beforeRoute() {
        application.changeRoute('agenda');
    },
    routes: {
        agenda: 'agenda',
        historique: 'historique'
    },
    agenda() {
        this._pageContent(AgendaView);
    },
    historique() {
        this._pageContent(HistoriqueView);
    }
});

