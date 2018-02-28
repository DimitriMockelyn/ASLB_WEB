import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import React from 'react';
import { navigate, views } from 'react-big-calendar/lib/utils/constants';
import {mixin as formMixin} from 'focus-components/common/form';
import builder from 'focus-core/util/url/builder';
BigCalendar.momentLocalizer(moment);
import {component as Popin} from 'focus-components/application/popin';
import userHelper from 'focus-core/user';
import Toggle from 'focus-components/components/input/toggle';
export default React.createClass({
    displayName: 'CalendarView',
    mixins: [formMixin],
    definitionPath: 'event',
    referenceNames: ['typeEvenements', 'niveauEvenements'],
    getInitialState() {
        return {
            events: this.props.events
        }
    },
    componentWillReceiveProps(newProps) {
        this.setState({events: newProps.events});
    },
    onSelectEvent(event) {
        if (this.props.canSelect) {
            this.props.onClickEvent(event);
        }
    },
    detectPropsEvent( event,
    start,
    end,
    isSelected) {
        var myId = userHelper.getLogin() && userHelper.getLogin()._id ? userHelper.getLogin()._id.toString() : '';
        var className = '';
        //Detection de la couleur pour le type d'evenement
        className = className + ' ' + (event.typeEvenement ? event.typeEvenement.code : '') + ' ';
        return {
            className: className
        }
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <BigCalendar
                events={this.state.events}
                startAccessor='startDate'
                endAccessor='endDate'
                views={[views.MONTH]}
                defaultView={views.MONTH}
                popup={true}
                onSelectEvent={this.onSelectEvent}
                culture='fr-FR'
                selectable={true}
                onSelectSlot={this.createEvent}
                onNavigate={this.onNavigateCalendar}
                selectable='ignoreEvents'
                eventPropGetter={this.detectPropsEvent}
                messages={{next: 'Mois suivant', today: 'Aujourd\'hui', previous: 'Mois précédent'}}
                components={this.props.components}
                />
        </div>
        );
    }
});
