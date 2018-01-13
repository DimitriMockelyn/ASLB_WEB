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
import Absents from '../absents';
export default React.createClass({
    getInitialState() {
        return {
        }
    },
    computeNote() {
        this.noteMoyenne = 0.0;
        this.nbNote = 0;
        this.nbCommentaires = 0;
        if (this.props.event.commentaires) {
            for (let index in this.props.event.commentaires) {
                let comm = this.props.event.commentaires[index];
                if (comm.note) {
                    this.noteMoyenne = (this.noteMoyenne*this.nbNote+comm.note)/(this.nbNote+1);
                    this.nbNote = this.nbNote +1;
                }
                if (comm.commentaire) {
                    this.nbCommentaires++;
                }
            }
        }
        return {noteMoyenne: this.noteMoyenne, nbNote: this.nbNote}
    },
    togglePopin() {
        this.props.event.toggleGestionAbsent(this.props.event._id);
    },
    /** @inheritDoc */
    render() {
        let notes = this.computeNote();
        return (
        <div>
            <div data-focus='display-row'>{this.props.title} <i className='material-icons' onClick={this.togglePopin}>person_outline</i> </div>
            <div data-focus='display-row'><Note value={notes.noteMoyenne} /> <div>{'('+notes.nbNote+')'}</div></div>
        </div>
        );
    }
});
