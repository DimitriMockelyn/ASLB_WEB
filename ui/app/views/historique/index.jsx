import React from 'react';
import EvenementParticipe from './event-participe';
import EvenementCoach from './event-coach';
import agendaServices from '../../services/agenda';
import Tabs from '../../components/tabs';
export default React.createClass({
    displayName: 'HistoriqueView',
    /** @inheritDoc */
    componentWillMount() {
        agendaServices.isCoach().then(res => {this.setState(res)});
    },
    getInitialState() {
        return {isCoach: false}
    },
    render() {
            var data = [];
            data.push({
                name: 'Historique participant',
                component: EvenementParticipe,
                props: {}
            });
            data.push({
                name: 'Historique du coaching',
                component: EvenementCoach,
                props: {}
            });
            return (
                <Tabs tabs={data} initialTab={this.props.animation ? 1 : 0}/>
            );
    }
});
