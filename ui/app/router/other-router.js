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
import AdminUsersView from '../views/admin/admin-users';
import AdminBlocsView from '../views/admin/admin-blocs';
import EspacesView from '../views/espaces';
import UserView from '../views/user-info';
import MachinesView from '../views/machines';
import MachinesLiveView from '../views/machines/live';

export default createRouter(Backbone).extend({
    log: true,
    beforeRoute() {
        application.changeRoute('other');
    },
    routes: {
        partenaires: 'partenaires',
        contact: 'contact',
        admin: 'admin',
        adminUsers: 'adminUsers',
        adminBlocs: 'adminBlocs',
        me: 'me',
        media: 'media',
        espaces: 'espaces',
        inscription: 'inscription',
        'u/:id': 'userView',
        machines: 'machines',
        machinesLive: 'machinesLive'
    },

    partenaires() {
        this._pageContent(PartenaireView, {props: {hasLoad: false}});
    },
    contact() {
        this._pageContent(ContactView, {props: {hasLoad: false}});
    },
    espaces() {
        this._pageContent(EspacesView, {props: {hasLoad: false}});
    },
    admin() {
        if (userHelper.getLogin() && userHelper.getLogin().isAdmin) {
            this._pageContent(AdminView, {props: {hasLoad: false}});
        }
    },
    adminUsers() {
        if (userHelper.getLogin() && userHelper.getLogin().isAdmin) {
            this._pageContent(AdminUsersView, {props: {hasLoad: false}});
        }
    },
    adminBlocs() {
        if (userHelper.getLogin() && userHelper.getLogin().isAdmin) {
            this._pageContent(AdminBlocsView, {props: {hasLoad: false}});
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
    },
    userView(id) {
        this._pageContent(UserView, {props: {id}});
    },
    machines() {
        this._pageContent(MachinesView);
    },
    machinesLive() {
        this._pageContent(MachinesLiveView);
    }
});

