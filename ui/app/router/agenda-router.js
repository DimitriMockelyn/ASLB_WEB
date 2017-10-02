import application from 'focus-core/application';
import createRouter from 'focus-core/router';
import AgendaView from '../views/agenda';
import userHelper from 'focus-core/user';
import history from 'focus-core/history';
export default createRouter(Backbone).extend({
    log: true,
    beforeRoute() {
        application.changeRoute('agenda');
    },
    routes: {
        agenda: 'agenda'
    },
    agenda() {
        this._pageContent(AgendaView);
    }
});

