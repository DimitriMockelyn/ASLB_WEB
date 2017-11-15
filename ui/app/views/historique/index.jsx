import React from 'react';
import agendaServices from '../../services/agenda';
import EventItem from '../home/evenements/event-item';
export default React.createClass({
    displayName: 'HistoriqueView',

    componentWillMount() {
        this.setState({});
        agendaServices.loadMyHistory().then(res => {this.setState({history: res})});
    },
    onClickEvent(value) {
        console.log(value);
    },
    /** @inheritDoc */
    render() {
        return (
        <div>
            <label style={{'margin-left': '20px'}}>{i18n.t('historique.description')}</label>
            <div>
                {this.state.history && <label>{this.state.history.length + i18n.t('historique.eventsParticipant')} </label> }
                <div>{this.state.history && this.state.history.length > 0 && this.state.history.map((value, pos) => {
                        return <div data-focus='' onClick={() => {this.onClickEvent(value)}}><EventItem data={value}/></div>
                })}
                </div>
            </div>
        </div>
        );
    }
});
