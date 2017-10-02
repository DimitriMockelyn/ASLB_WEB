import application from 'focus-core/application';
import createRouter from 'focus-core/router';
import HomeView from '../views/home';
import userHelper from 'focus-core/user';
import history from 'focus-core/history';
export default createRouter(Backbone).extend({
    log: true,
    beforeRoute() {
        application.changeRoute('home');
    },
    routes: {
        '': 'home',
        home: 'home'
    },
    home() {
        this._pageContent(HomeView);
    }
});

