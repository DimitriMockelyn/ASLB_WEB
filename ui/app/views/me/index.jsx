import React from 'react';
import agendaServices from '../../services/agenda';
import Tabs from '../../components/tabs';
import ScrollspyContainer from 'focus-components/components/scrollspy-container';
import MesInformations from './mes-informations';

export default React.createClass({
    displayName: 'MeView',
    /** @inheritDoc */
    render() {
        
        return (
        <ScrollspyContainer>
            <MesInformations hasLoad={false} hasForm={false}/>
        </ScrollspyContainer>
        );
    }
});
