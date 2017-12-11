import React from 'react';
import {component as Button} from 'focus-components/common/button/action';
import moment from 'moment';
import Tile from './tile';
import userHelper from 'focus-core/user';

export default React.createClass({
    displayName: 'HomeView',
    getInitialState() {
        return {currentWeek: this.props.week || this.getCurrentWeek(), events: this.props.events, jours: [[],[],[],[],[]]}
    },
    componentWillReceiveProps(newProps) {
        if (newProps.events) {
            this.setState({events: newProps.events}, this.computeEventsPerDay);
        } else {
            this.setState({events: [], jours: [[],[],[],[],[]]});
        }
    },
    componentDidMount() {
        moment.locale('fr');
        this.computeEventsPerDay();
    },
    getCurrentWeek() {
        return moment().week();
    },
    resetDate() {
        this.setState({currentWeek: this.getCurrentWeek(), jours: [[],[],[],[],[]]}, this.computeEventsPerDay);
        this.props.onNavigate('','','TODAY');
    },
    computeEventsPerDay() {
        let state = this.state;
        state.jours = [[],[],[],[],[]];
        if (this.state.events && this.state.events.length > 0) {
            this.state.events.map(event => {
                // on range les evenements dans la bonne case
                let dateDebut = moment(event.startDate);
                //Gestion des evenements hyper loin
                var currentWeekReal = moment().week(this.state.currentWeek);

                if (currentWeekReal.isoWeekday(1).startOf('week').isBefore(dateDebut) && currentWeekReal.isoWeekday(1).endOf('week').isAfter(dateDebut) && dateDebut.weekday() < 5 ) {
                    state.jours[dateDebut.weekday()].push(event);
                }
            });
        }
        //Tri des evenements par date de debut
        //Mise dans le state
        this.setState(state);
    },
    addDate(offset) {
        this.setState({currentWeek: this.state.currentWeek + offset}, this.computeEventsPerDay);
        if (offset === 1) {
            this.props.onNavigate('','','NEXT');
        }
        if (offset === -1) {
            this.props.onNavigate('','','PREV');
        }
    },
    create() {
        this.props.onCreateSlot({});
    },
    /** @inheritDoc */
    render() {
        return (<div>
            <div className="rbc-toolbar">
                <span className="rbc-btn-group">
                    <button type="button" onClick={() => {this.resetDate()}}>Aujourd'hui</button>
                    <button type="button" onClick={() => {this.addDate(-1)}}>Semaine précédente</button>
                    <button type="button" onClick={() => {this.addDate(1)}}>Semaine suivante</button>
                    {(userHelper.getLogin() && userHelper.getLogin().canCreate) && <button type="button" onClick={() => {this.create()}}>Créer un évènement</button>}
                </span>
            </div>
            <div data-focus='week-bar'>
                {this.state.jours && this.state.jours.map((jour, index) => {
                    return <div>
                            <label>{moment.weekdaysShort()[index+1]  + ' ' + moment().week(this.state.currentWeek).day(index+1).format('DD/MM')}</label>
                            <div data-focus='tile-list'>
                            {jour.length > 0 && jour.map( event => {
                                return <Tile data={event} eventPropGetter={this.props.eventPropGetter} onClickTile={() => {this.props.onSelectEvent(event)}} />
                            })}
                            </div>
                        </div>
                })}
            </div>
        </div>
        );
    }
});
