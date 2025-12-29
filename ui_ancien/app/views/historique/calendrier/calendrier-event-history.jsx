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
    noteMoyenne : 0.0,
    nbNote: 0,
    nbCommentaires : 0,
    computeNote() {
        this.noteMoyenne = 0.0;
        this.nbNote = 0;
        this.nbCommentaires = 0;
        if (this.state.noteComm && this.state.noteComm.listeCommentaires && this.state.noteComm.listeCommentaires.length > 0) {
            for (let index in this.state.noteComm.listeCommentaires) {
                let comm = this.state.noteComm.listeCommentaires[index];
                if (comm.note) {
                    this.noteMoyenne = (this.noteMoyenne*this.nbNote+comm.note)/(this.nbNote+1);
                    this.nbNote = this.nbNote +1;
                }
                if (comm.commentaire) {
                    this.nbCommentaires++;
                }
            }
        }
        this.setState({updated: !this.state.updated});
    },
    getInitialState() {
        return {
        }
    },
    componentWillMount() {
        agendaServices.loadCommentaire(this.props.event._id).then(res => { this.setState({noteComm : res}, this.computeNote)});
    },
    componentWillReceiveProps() {
        agendaServices.loadCommentaire(this.props.event._id).then(res => { this.setState({noteComm : res}, this.computeNote)});
    },
    /** @inheritDoc */
    render() {
        return (
        <div>
            <div title={this.props.title} className='ellipsis'>{this.props.title}</div>
            <div data-focus='display-row' title={this.nbNote > 0 ? Math.floor(this.noteMoyenne*100)/100 + '/5, '+this.nbNote+ ' avis' : ''}>
                <Note isConsult={true} value={(this.state.noteComm && this.state.noteComm.note) || 0} />
                <div>{this.nbNote > 0 && Math.floor(this.noteMoyenne*100)/100 + '/5, '+this.nbNote+ ' avis'}</div>
            </div>
        </div>
        );
    }
});
