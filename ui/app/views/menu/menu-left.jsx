import React from 'react';
import Menu from './menu';
import {navigate} from 'focus-core/history';
import userHelper from 'focus-core/user';

import {getConfig} from '../../config';

function computeMenuItem() {
    return [
        { icon: 'home', name: 'Accueil', route: '' },
        { icon: 'date_range', name: 'Agenda', route: 'agenda'},
        { icon: 'fitness_center', name: 'Espaces et matériel', route: 'espaces'},
        { icon: 'call', name: 'Contacts et informations', route: 'contact'},
        { icon: 'business', name: 'Partenaires', route: 'partenaires'},
        { icon: 'camera', name: 'Média', route: 'media'}
    ];
}

export default () => {
    let menu = computeMenuItem();
    if (userHelper.getLogin()) {
        menu.splice(2, 0, {icon: 'history', name: 'Historique', route: 'historique'});
    }
    if (userHelper.getLogin() && userHelper.getLogin().isAdmin) {
        menu.push({icon: 'show_chart', name: 'Administration', route: 'admin'})
    }
    return (
        <Menu items={menu} handleBrandClick={() => {navigate('/',true)}} />
    );
};
