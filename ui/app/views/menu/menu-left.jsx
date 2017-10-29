import React from 'react';
import Menu from 'focus-components/components/menu';
import history from 'focus-core/history';
import userHelper from 'focus-core/user';

import {getConfig} from '../../config';

function computeMenuItem() {
    return [
        { icon: 'home', name: 'Accueil', route: '' },
        { icon: 'date_range', name: 'Agenda', route: 'agenda'},
        { icon: 'business', name: 'Partenaires', route: 'partenaires'},
        { icon: 'call', name: 'Contacts et informations', route: 'contact'}
    ];
}

export default () => {
    let menu = computeMenuItem();
    if (userHelper.getLogin() && userHelper.getLogin().isAdmin) {
        menu.push({icon: 'show_chart', name: 'Administration', route: 'admin'})
    }
    return (
        <Menu items={menu} />
    );
};
