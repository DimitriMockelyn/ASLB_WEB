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
import TileView from './tile-view';
export default React.createClass({
    displayName: 'CalendarView',
    mixins: [formMixin],
    definitionPath: 'event',
    referenceNames: ['typeEvenements', 'niveauEvenements'],
    initialized : false,
    getInitialState() {
        return {
            events : [],
            selectedEvent : undefined,
            serviceLoad: agendaServices.loadAll,
            fullView: false,
            calendarView: false,
            currentWeek : moment().isoWeek()
        }
    },
    afterChange(changeInfos) {
        if (changeInfos.property === 'niveauEvenements') {
            this.loadAllEvents().then((res) => {
                if (!this.initialized) {
                    this.initialized = true;
                    if (this.props.eventId) {
                        let id = this.props.eventId.toString();
                        let sel = res.find(elt => { return elt._id.toString() === id });
                        //On recherche la bonne semaine
                        //Gestion des evenements hyper loin
                        var currentWeekNum = this.state.currentWeek-1;
                        var currentWeekReal = moment().week(currentWeekNum);
                        while (!(currentWeekReal.day(1).startOf('week').isBefore(sel.startDate) && currentWeekReal.day(1).endOf('week').isAfter(sel.startDate)) && currentWeekNum < this.state.currentWeek+500) {
                            currentWeekNum++;
                            currentWeekReal = moment().week(currentWeekNum);
                        }
                        this.setState({selectedEvent: sel, currentWeek : currentWeekNum});

                    }
                }
            });
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
    onChangeCalendar() {
        this.setState({
            calendarView: !this.state.calendarView})
    },
    onChangeCalendarFromLabel() {
        var showIsChecked = !this.state.calendarView;
        this.onChangeCalendar();
        if (showIsChecked) {
            this.refs['toggle-cal'].refs['mdlHolder'].classList.add('is-checked');
        } else {
            this.refs['toggle-cal'].refs['mdlHolder'].classList.remove('is-checked');
        }
    },
    componentWillMount() {
        //this.loadAllEvents();
    },
    computeNiveau(id) {
        if (!id || !this.state.reference || !this.state.reference.niveauEvenements) {
            return '';
        }

        return this.state.reference.niveauEvenements.find(data => { return data._id === id}).name;
    },
    loadAllEvents() {
        if ( userHelper.getLogin() && userHelper.getLogin()._id ) {
            agendaServices.loadTokens().then(res => {
                this.setState({tokensRestant: res.count});
            })
            window.computeTokens();
        }
        return this.state.serviceLoad().then(res => {
            const events = []
            
            res.map((event) => {
               
                if (event) {
                    //get by id
                    let title = event.name + ' ' +this.computeNiveau(event.niveau) + ' (';
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
            return events;
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
                if  (event.typeEvenement && typeEvt._id.toString() === event.typeEvenement.toString()) {
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
    onNavigateCalendar(data, data2, type) {
        if (type === 'TODAY') {
            this.setState({currentWeek : moment().week()})
        } else if (type === 'PREV') {
            this.setState({currentWeek : this.state.currentWeek -1})
        } else if (type === 'NEXT') {
            this.setState({currentWeek : this.state.currentWeek +1})
        }
    },
    sendEmail() {
        
    },
    togglePopinLegende(code) {
        return () => {
            this.setState({legendePopin: code});
        }
    },
    closePopinLegende() {
        this.setState({legendePopin: undefined});
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
            { userHelper.getLogin() && userHelper.getLogin()._id && <label>Vous pouvez encore vous inscrire à {this.state.tokensRestant} activités. Ce compteur reviendra a son maximum lorsque les activités où vous êtes inscrit seront passées</label>}
            <div data-focus='display-row'>
                { userHelper.getLogin() && userHelper.getLogin()._id && <div data-focus='toggle-bar'>
                    <label onClick={this.onChangeViewFromLabel}>{i18n.t('agenda.all')}</label>
                    <Toggle ref='toggle' value={this.state.fullView} label={i18n.t('agenda.mine')} onChange={this.onChangeView} />
                </div>}
                <div data-focus='toggle-bar'>
                    <label onClick={this.onChangeCalendarFromLabel}>{i18n.t('agenda.tile')}</label>
                    <Toggle ref='toggle-cal' value={this.state.calendarView} label={i18n.t('agenda.calendar')} onChange={this.onChangeCalendar} />
                </div>
            </div>
            {this.state.calendarView &&
            <BigCalendar
                events={this.state.events}
                startAccessor='startDate'
                endAccessor='endDate'
                views={[views.WORK_WEEK]}
                defaultView={views.WORK_WEEK}
                onSelectEvent={this.onSelectEvent}
                culture='fr-FR'
                selectable={true}
                onSelectSlot={this.createEvent}
                onNavigate={this.onNavigateCalendar}
                date={moment().week(this.state.currentWeek).day(3)}
                min={minTime}
                max={maxTime}
                selectable='ignoreEvents'
                eventPropGetter={this.detectPropsEvent}
                messages={{next: 'Semaine suivante', today: 'Aujourd\'hui', previous: 'Semaine précédente', week: 'Vue semaine', day: 'Vue journée'}}
                />}
                {!this.state.calendarView && <TileView 
                    events={this.state.events}
                    onSelectEvent={this.onSelectEvent}
                    onCreateSlot={this.createEvent}
                    eventPropGetter={this.detectPropsEvent}
                    onNavigate={this.onNavigateCalendar}
                    week={this.state.currentWeek}
                    niveaux={this.state.reference && this.state.reference.niveauEvenements}
                />}
                <div data-focus='legend'>
                    <label>{i18n.t('agenda.legende')}</label>
                    <label className='legend-star'>{i18n.t('agenda.legendeStar')}</label>
                    {this.state.reference && this.state.reference.typeEvenements && this.state.reference.typeEvenements.map((data,index) => {
                        var firstChild = index === 0 ? 'first' :'';
                        return <div data-focus='legend-item' className={firstChild} onClick={this.togglePopinLegende(data.code)}>
                                <div className={'rbc-event ' + data.code } />
                                <div>{data.name} </div>
                            </div>
                    })}
                </div>

            {this.state.selectedEvent && <Popin open={true}  onPopinClose={this.closePopin}>
                <EventInfos tokensRestant={this.state.tokensRestant} event={this.state.selectedEvent} onPopinClose={this.closePopin} isEdit={false} hasLoad={false} hasForm={false}/>
            </Popin>}
            {this.state.creerEvent && <Popin open={true}  onPopinClose={this.closeCreerEvent}>
                <CreateEvent data={this.state.creerEvent} onPopinClose={this.closeCreerEvent} hasLoad={false} hasForm={false}/>
            </Popin>}
            {this.state.legendePopin && <Popin open={true}  onPopinClose={this.closePopinLegende}>
                <div data-focus='legende-description'>
                    <label>{this.state.reference.typeEvenements.find(data => {return data.code === this.state.legendePopin}).name}</label>
                    <div dangerouslySetInnerHTML={{ __html: this.state.reference.typeEvenements.find(data => { return data.code === this.state.legendePopin}).description}}/>
                </div>
            </Popin>}
        </div>
        );
    }
});
