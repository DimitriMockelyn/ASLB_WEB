import React from 'react';
import Menu from 'focus-components/components/menu';
import history from 'focus-core/history';
import userHelper from 'focus-core/user';

import {getConfig} from '../../config';

function computeMenuItem() {
    return [
        { icon: 'home', name: 'Accueil', route: '' },
        { icon: 'date_range', name: 'Agenda', route: 'agenda'},
        { icon: 'business', name: 'Partenaires', route: 'partenaires'}
    ];
}

export default () => {
    return (
        <Menu items={computeMenuItem()} />
    );
};
