import React from 'react';
import EvenementParticipe from './event-participe';
import EvenementCoach from './event-coach';
import agendaServices from '../../services/agenda';
import Tabs from '../../components/tabs';
import {component as Popin} from 'focus-components/application/popin';
export default React.createClass({
    displayName: 'HistoriqueView',
    /** @inheritDoc */
    componentWillMount() {
        agendaServices.isCoach().then(res => {this.setState({...res, togglePopinExplication : !res.isCoach && this.props.animation})});
    },
    getInitialState() {
        return {isCoach: undefined}
    },
    closeExplications() {
        this.setState({togglePopinExplication: false});
    },
    render() {
            var data = [];
            data.push({
                name: 'Mon Historique',
                component: EvenementParticipe,
                props: {}
            });
            if (this.state.isCoach) {
                data.push({
                    name: 'Historique du coaching',
                    component: EvenementCoach,
                    props: {}
                });
            }
            if (this.state.isCoach === undefined) {
                return <div/>
            }
            return (
                <div>
                <Tabs tabs={data} initialTab={this.props.animation && this.state.isCoach ? 1 : 0}/>
                {this.state.togglePopinExplication && <Popin size='small' open={true} onPopinClose={this.closeExplications}>
                        <div data-focus='display-column'>
                            <label>{i18n.t('historique.notCoachYet')}</label>
                            <label>{i18n.t('historique.howToCoach')}</label>
                            <label>{i18n.t('historique.coachBenefits')}</label>
                            <label>{i18n.t('historique.coachContact')}</label>
                            <label>{i18n.t('historique.signature')}</label>
                        </div>
                    </Popin>}
                </div>
            );
    }
});
