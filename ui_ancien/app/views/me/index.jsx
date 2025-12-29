import React from 'react';
import agendaServices from '../../services/agenda';
import Tabs from '../../components/tabs';
import ScrollspyContainer from 'focus-components/components/scrollspy-container';
import MesInformations from './mes-informations';
import ChangePassword from './changePassword';
import MonProfil from './mon-profil';

export default React.createClass({
    displayName: 'MeView',
    /** @inheritDoc */
    render() {
        
        return (
        <ScrollspyContainer>
            <MonProfil hasLoad={false} hasForm={false} />
            <MesInformations hasLoad={false} hasForm={false}/>
            <ChangePassword hasLoad={false} hasForm={false}/>
        </ScrollspyContainer>
        );
    }
});
