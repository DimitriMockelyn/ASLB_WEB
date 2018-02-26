import React from 'react';
import agendaServices from '../../services/agenda';
import EventItem from './event-item';
import CommentaireEvenement from './commentaire';
import Calendar from './calendrier'; 
import MyEvent from './calendrier/calendrier-event-history';
import {component as Popin} from 'focus-components/application/popin';
import {downloadCSV} from '../../utils/download';
import {component as Button} from 'focus-components/common/button/action';
import userHelper from 'focus-core/user';

export default React.createClass({
    displayName: 'HistoriqueView',

    componentWillMount() {
        this.setState({});
        this.loadHistory();
    },
    export() {
        agendaServices.exportMyHistory().then(res => {downloadCSV(res, 'historique.csv')});;
    },
    loadHistory() {
        agendaServices.loadMyHistory().then(res => {
            const events = []
            this.setState({history: res})
            res.map((event) => {
               
                if (event) {
                    //get by id
                    let title = (event.typeEvenement ? event.typeEvenement.name : '') + ' - ' + event.name ;
                    var endDate = new Date(event.date_debut);
                    endDate.setMinutes(endDate.getMinutes() + event.duree);
                    events.push({
                        ...event,
                        startDate: new Date(event.date_debut),
                        endDate: endDate,
                        title: title,
                    });
                }
            })
            this.setState({historyCal: events})
        });
    },
    onClickEvent(value) {
        this.setState({eventClicked: value});
    },
    closeCommentaire() {
        this.setState({eventClicked: undefined});
    },
    /** @inheritDoc */
    render() {
        //this.onClickEvent(value)
        let components = {
            agenda: {
                event: MyEvent // with the agenda view use a different component to render events
           },
           event: MyEvent
        }
        return (
        <div>
            <div data-focus='display-row' className='display-center'>
            <label style={{'margin-left': '20px'}}>{i18n.t('historique.description')}</label>
            {userHelper.getLogin() && this.state.history && this.state.history.length > 0 && <Button label='Exporter' icon='file_download' handleOnClick={this.export} type='button'/>}
            </div>
            <div data-focus='historique-list'>
                {this.state.history && <label>{this.state.history.length + i18n.t('historique.eventsParticipant')} </label> }
                    <Calendar ref='calendar' canSelect={this.state.eventClicked === undefined} hasLoad={false} hasForm={false} events={this.state.historyCal || []} onClickEvent={this.onClickEvent} components={components} />
            </div>
            {this.state.eventClicked && <Popin open={true}  onPopinClose={this.closeCommentaire}>
                <CommentaireEvenement data={this.state.eventClicked} onPopinClose={this.closeCommentaire} hasLoad={false} hasForm={false}/>
            </Popin>}
        </div>
        );
    }
});
