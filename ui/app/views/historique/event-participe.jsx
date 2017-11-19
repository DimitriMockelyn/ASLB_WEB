import React from 'react';
import agendaServices from '../../services/agenda';
import EventItem from './event-item';
import CommentaireEvenement from './commentaire';

import {component as Popin} from 'focus-components/application/popin';
export default React.createClass({
    displayName: 'HistoriqueView',

    componentWillMount() {
        this.setState({});
        agendaServices.loadMyHistory().then(res => {this.setState({history: res})});
    },
    onClickEvent(value) {
        this.setState({eventClicked: value});
    },
    closeCommentaire() {
        this.setState({eventClicked: undefined});
    },
    /** @inheritDoc */
    render() {
        return (
        <div>
            <label style={{'margin-left': '20px'}}>{i18n.t('historique.description')}</label>
            <div data-focus='historique-list'>
                {this.state.history && <label>{this.state.history.length + i18n.t('historique.eventsParticipant')} </label> }
                <div>{this.state.history && this.state.history.length > 0 && this.state.history.map((value, pos) => {
                        return <div data-focus='historique-evenements' onClick={() => {this.onClickEvent(value)}}><EventItem data={value}/></div>
                })}
                </div>
            </div>
            {this.state.eventClicked && <Popin open={true}  onPopinClose={this.closeCommentaire}>
                <CommentaireEvenement data={this.state.eventClicked} onPopinClose={this.closeCommentaire} hasLoad={false} hasForm={false}/>
            </Popin>}
        </div>
        );
    }
});