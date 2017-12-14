import application from 'focus-core/application';
import createRouter from 'focus-core/router';
import HomeView from '../views/home';
import userHelper from 'focus-core/user';
import history from 'focus-core/history';
import PartenaireView from '../views/partenaires';
import ContactView from '../views/contact';
import AdminView from '../views/admin';
import MeView from '../views/me';
import MediaView from '../views/media';
import InscriptionView from '../views/inscription';

export default createRouter(Backbone).extend({
    log: true,
    beforeRoute() {
        application.changeRoute('other');
    },
    routes: {
        partenaires: 'partenaires',
        contact: 'contact',
        admin: 'admin',
        me: 'me',
        media: 'media',
        inscription: 'inscription'
    },

    partenaires() {
        this._pageContent(PartenaireView, {props: {hasLoad: false}});
    },
    contact() {
        this._pageContent(ContactView, {props: {hasLoad: false}});
    },
    admin() {
        if (userHelper.getLogin() && userHelper.getLogin().isAdmin) {
            this._pageContent(AdminView, {props: {hasLoad: false}});
        }
    },
    me() {
        this._pageContent(MeView);
    },
    media() {
        this._pageContent(MediaView);
    },
    inscription() {
        this._pageContent(InscriptionView);
    }
});

