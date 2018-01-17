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
import agendaServices from '../../../services/agenda';
import Note from '../../../components/note';
export default React.createClass({
    getInitialState() {
        return {
        }
    },
    componentWillMount() {
        agendaServices.loadCommentaire(this.props.event._id).then(res => { this.setState({noteComm : res})});
    },
    componentWillReceiveProps() {
        agendaServices.loadCommentaire(this.props.event._id).then(res => { this.setState({noteComm : res})});
    },
    /** @inheritDoc */
    render() {
        return (
        <div>
            <div>{this.props.title}</div>
            <div><Note isConsult={true} value={(this.state.noteComm && this.state.noteComm.note) || 0} /></div>
        </div>
        );
    }
});
