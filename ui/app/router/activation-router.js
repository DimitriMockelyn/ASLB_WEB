import application from 'focus-core/application';
import createRouter from 'focus-core/router';
import ActivationView from '../views/activation';
import ChangePasswordView from '../views/changePassword';
import userHelper from 'focus-core/user';
import history from 'focus-core/history';
export default createRouter(Backbone).extend({
    log: true,
    beforeRoute() {
        application.changeRoute('activation');
    },
    routes: {
        'activation/:id': 'activation',
        'changePassword/:code': 'changePassword'
    },
    activation(id) {
        this._pageContent(ActivationView, {props: {id:id}});
    },
    changePassword(code) {
        this._pageContent(ChangePasswordView, {props: {code:code}});
    },
});

