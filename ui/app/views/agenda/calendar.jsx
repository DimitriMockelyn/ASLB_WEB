import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import React from 'react';
import { navigate, views } from 'react-big-calendar/lib/utils/constants';
import fetch from '../../utils/fetch';
import {mixin as formMixin} from 'focus-components/common/form';
import builder from 'focus-core/util/url/builder';
BigCalendar.momentLocalizer(moment);
import {component as Popin} from 'focus-components/application/popin';
import EventInfos from './event-infos';
import agendaServices from '../../services/agenda';
import CreateEvent from './create-event';
import userHelper from 'focus-core/user';
import Toggle from 'focus-components/components/input/toggle';
export default React.createClass({
    displayName: 'CalendarView',
    mixins: [formMixin],
    definitionPath: 'event',
    referenceNames: ['typeEvenements'],
    getInitialState() {
        return {
            events : [],
            selectedEvent : undefined,
            serviceLoad: agendaServices.loadAll,
            fullView: false
        }
    },
    onChangeView() {
        this.setState({
            serviceLoad: this.state.serviceLoad === agendaServices.loadAll ? agendaServices.loadMine :  agendaServices.loadAll,
            fullView: !this.state.fullView
        }, () => {this.loadAllEvents()})
    },
    onChangeViewFromLabel() {
        var showIsChecked = !this.state.fullView;
        this.onChangeView();
        if (showIsChecked) {
            this.refs['toggle'].refs['mdlHolder'].classList.add('is-checked');
        } else {
            this.refs['toggle'].refs['mdlHolder'].classList.remove('is-checked');
        }
    },
    componentWillMount() {
        this.loadAllEvents();
    },
    loadAllEvents() {
        this.state.serviceLoad().then(res => {
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
    },
    closePopin() {
        this.setState({selectedEvent : undefined});
        this.loadAllEvents();
    },
    createEvent(slotInfo) {
        if (userHelper.getLogin() && userHelper.getLogin().canCreate) {
            this.setState({creerEvent: slotInfo});
        }
    },
    closeCreerEvent() {
        this.setState({creerEvent: undefined});
        this.loadAllEvents();
    },
    detectPropsEvent( event,
    start,
    end,
    isSelected) {
        var myId = userHelper.getLogin() && userHelper.getLogin()._id ? userHelper.getLogin()._id.toString() : '';
        var className = '';
        //Detection de la couleur pour le type d'evenement
        if (this.state && this.state.reference && this.state.reference.typeEvenements) {
            for (let index in this.state.reference.typeEvenements) {
                let typeEvt = this.state.reference.typeEvenements[index];
                if  (typeEvt._id.toString() === event.typeEvenement.toString()) {
                    className = className + ' ' + typeEvt.code + ' ';
                }
            }
        }
        //Evenement auquel je participe
        for (let index in event.participants) {
            if (event.participants[index]._id.toString() === myId) {
                className = className + ' participant ';
            }
        }
        return {
            className: className
        }
    },
    sendEmail() {
        
    },

    /** @inheritDoc */
    renderContent() {
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
            { userHelper.getLogin() && userHelper.getLogin()._id && <div data-focus='toggle-bar'>
                <label onClick={this.onChangeViewFromLabel}>{i18n.t('agenda.all')}</label>
                <Toggle ref='toggle' value={this.state.fullView} label={i18n.t('agenda.mine')} onChange={this.onChangeView} />
            </div>}
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
                selectable='ignoreEvents'
                eventPropGetter={this.detectPropsEvent}
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
