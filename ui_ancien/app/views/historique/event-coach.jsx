import React from 'react';
import agendaServices from '../../services/agenda';
import EventNote from './event-note';
import CommentairesNoteEvenement from './commentaires-event';
import Calendar from './calendrier'; 
import {component as Popin} from 'focus-components/application/popin';
import MyEventCoach from './calendrier/calendrier-event-coach';
import Absents from './absents';
import {downloadCSV} from '../../utils/download';
import {component as Button} from 'focus-components/common/button/action';
import userHelper from 'focus-core/user';
export default React.createClass({
    displayName: 'HistoriqueView',
    dontClick: false,
    export() {
        agendaServices.exportMyCoachHistory().then(res => {downloadCSV(res, 'historique_coach.csv')});;
    },
    componentWillMount() {
        this.setState({});
        agendaServices.loadMyCoachingHistory().then(res => {
            this.setState({history: res, togglePopinExplication: res.length === 0})
            const events = []
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
                        toggleGestionAbsent: this.toggleGestionAbsent
                    });
                }
            })
            this.setState({historyCal: events})
        
        });
    },
    onClickEvent(value) {
        if (this.dontClick) {
            this.dontClick = false;
        } else {
            this.setState({eventClicked: value});
        }
    },
    closeCommentaire() {
        this.setState({eventClicked: undefined});
    },
    toggleGestionAbsent(id) {
        this.dontClick= true;
        this.setState({togglePopinAbsent : id});
    },
    closePopin() {
        this.dontClick= false;
        this.setState({togglePopinAbsent : undefined});
    },
    /** @inheritDoc */
    render() {
        let components = {
            agenda: {
                event: MyEventCoach // with the agenda view use a different component to render events
           },
           event: MyEventCoach
        }
        return (
            <div>
                {this.state.history && this.state.history.length > 0 && <div>
                    <div data-focus='display-row' className='display-center'>
                    <label style={{'margin-left': '20px'}}>{i18n.t('historique.descriptionCoach')}</label>
                    {userHelper.getLogin() && this.state.history && this.state.history.length > 0 && <Button label='Exporter' icon='file_download' handleOnClick={this.export} type='button'/>}
                    </div>
                    <div data-focus='historique-list'>
                        {this.state.history && <label>{this.state.history.length + i18n.t('historique.eventsParticipant')} </label> }
                        <Calendar  canSelect={this.state.eventClicked === undefined} hasLoad={false} hasForm={false} events={this.state.historyCal || []} onClickEvent={this.onClickEvent} components={components} />
                    </div>
                    {this.state.eventClicked && <Popin open={true}  onPopinClose={this.closeCommentaire}>
                        <CommentairesNoteEvenement data={this.state.eventClicked} onPopinClose={this.closeCommentaire} hasLoad={false} hasForm={false}/>
                    </Popin>}
                    {this.state.togglePopinAbsent && <Popin open={true} type='from-right' onPopinClose={this.closePopin}>
                        <Absents id={this.state.togglePopinAbsent} />
                    </Popin>}
                </div>}
            </div>
        );
    }
});
