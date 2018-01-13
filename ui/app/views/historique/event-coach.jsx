import React from 'react';
import agendaServices from '../../services/agenda';
import EventNote from './event-note';
import CommentairesNoteEvenement from './commentaires-event';

import {component as Popin} from 'focus-components/application/popin';
export default React.createClass({
    displayName: 'HistoriqueView',

    componentWillMount() {
        this.setState({});
        agendaServices.loadMyCoachingHistory().then(res => {this.setState({history: res, togglePopinExplication: res.length === 0})});
    },
    onClickEvent(value) {
        this.setState({eventClicked: value});
    },
    closeCommentaire() {
        this.setState({eventClicked: undefined});
    },
    closeExplications() {
        this.setState({togglePopinExplication: false});
    },
    /** @inheritDoc */
    render() {
        return (
            <div>
                {this.state.togglePopinExplication && <Popin size='small' open={true} onPopinClose={this.closeExplications}>
                        <div data-focus='display-column'>
                            <label>{i18n.t('historique.notCoachYet')}</label>
                            <label>{i18n.t('historique.howToCoach')}</label>
                            <label>{i18n.t('historique.coachBenefits')}</label>
                            <label>{i18n.t('historique.coachContact')}</label>
                        </div>
                    </Popin>}
                {this.state.history && this.state.history.length > 0 && <div>
                    <label style={{'margin-left': '20px'}}>{i18n.t('historique.descriptionCoach')}</label>
                    <div data-focus='historique-list'>
                        {this.state.history && <label>{this.state.history.length + i18n.t('historique.eventsParticipant')} </label> }
                        <div>{this.state.history && this.state.history.length > 0 && this.state.history.map((value, pos) => {
                                return <div data-focus='historique-evenements' ><EventNote data={value} onClick={() => {this.onClickEvent(value)}}/></div>
                        })}
                        </div>
                    </div>
                    {this.state.eventClicked && <Popin open={true}  onPopinClose={this.closeCommentaire}>
                        <CommentairesNoteEvenement data={this.state.eventClicked} onPopinClose={this.closeCommentaire} hasLoad={false} hasForm={false}/>
                    </Popin>}
                </div>}
            </div>
        );
    }
});
