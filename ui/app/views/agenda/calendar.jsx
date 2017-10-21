import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import React from 'react';
import { navigate, views } from 'react-big-calendar/lib/utils/constants';
import fetch from '../../utils/fetch';
import builder from 'focus-core/util/url/builder';
BigCalendar.momentLocalizer(moment);
import {component as Popin} from 'focus-components/application/popin';
import EventInfos from './event-infos';
import agendaServices from '../../services/agenda';
import CreateEvent from './create-event';


export default React.createClass({
    displayName: 'CalendarView',
    getInitialState() {
        return {
            events : [],
            selectedEvent : undefined
        }
    },
    componentWillMount() {
        this.loadAllEvents();
    },
    loadAllEvents() {
        agendaServices.loadAll().then(res => {
            const events = []
            
            res.map((event) => {
               
                if (event) {
                    //get by id
                    let title = event.name + ' (';
                    if (event.participants) {
                        if (event.participants.length === 1) {
                            title = title + event.participants.length + ' participant)';
                        } else {
                            title = title + event.participants.length + ' participants)';
                        }
                    } else {
                        title = title + '0 participants)';
                    }
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
            this.setState({events});
        });
    },
    onSelectEvent(event) {
        this.setState({selectedEvent : event});
        console.log('Evenement Selectionné :', event);
    },
    closePopin() {
        this.setState({selectedEvent : undefined});
        this.loadAllEvents();
    },
    createEvent(slotInfo) {
        console.log(slotInfo);
        this.setState({creerEvent: slotInfo});
        //TODO creer evenement
    },
    closeCreerEvent() {
        this.setState({creerEvent: undefined});
        this.loadAllEvents();
    },
    /** @inheritDoc */
    render() {
        let minTime = new Date();
        let maxTime = new Date();
        minTime.setMilliseconds(0);
        minTime.setHours(7);
        minTime.setMinutes(0);
        minTime.setSeconds(0);

        maxTime.setMilliseconds(0);
        maxTime.setHours(20);
        maxTime.setMinutes(0);
        maxTime.setSeconds(0);
        return (
        <div>
            <BigCalendar
                events={this.state.events}
                startAccessor='startDate'
                endAccessor='endDate'
                views={[views.WEEK]}
                defaultView={views.WEEK}
                onSelectEvent={this.onSelectEvent}
                culture='fr-FR'
                selectable={true}
                onSelectSlot={this.createEvent}
                min={minTime}
                max={maxTime}
                messages={{next: 'Semaine suivante', today: 'Aujourd\'hui', previous: 'Semaine précédente', week: 'Vue semaine', day: 'Vue journée'}}
                />
            {this.state.selectedEvent && <Popin open={true} size='small' onPopinClose={this.closePopin}>
                <EventInfos event={this.state.selectedEvent} onPopinClose={this.closePopin} isEdit={false} hasLoad={false} hasForm={false}/>
            </Popin>}
            {this.state.creerEvent && <Popin open={true} size='small' onPopinClose={this.closeCreerEvent}>
                <CreateEvent data={this.state.creerEvent} onPopinClose={this.closeCreerEvent} hasLoad={false} hasForm={false}/>
            </Popin>}
        </div>
        );
    }
});
