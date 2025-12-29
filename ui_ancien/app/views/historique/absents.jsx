import React from 'react';
import agendaServices from '../../services/agenda';

import {component as Popin} from 'focus-components/application/popin';
export default React.createClass({
    displayName: 'HistoriqueView',
    getInitialState() {
        return {
            absents: [], presents: []
        }
    },
    componentWillMount() {
        this.setState({});
        this.reload();
    },
    computePresentAbsent(event) {
        let absents = event.absents || [];
        let presents = [];
        event.participants.map(personne => {
            let isAbsent = false;
            absents.map(abs => {
                if (abs._id.toString() === personne._id.toString()) {
                    isAbsent = true;
                }
            });
            if (!isAbsent) {
                presents.push(personne);
            }
        });
        return {absents: absents, presents: presents}
    },
    reload() {
        agendaServices.loadAbsents(this.props.id).then(res => {this.setState(this.computePresentAbsent(res))});
    },
    setAbsent(data) {
        agendaServices.setAbsent(data).then(this.reload);
    },
    setPresent(data) {
        agendaServices.setPresent(data).then(this.reload);
    },
    /** @inheritDoc */
    render() {
        console.log(this.state);
        return (
        <div data-focus='absent-present'>
            <div>
                <label> Présents </label>
                {this.state.presents.map(usr => {
                    return <div>
                        <label>{usr && (usr.prenom + ' ' + usr.nom)}</label>
                        <i className='material-icons' onClick={() => {this.setAbsent({id: this.props.id, user: usr._id})}}>keyboard_arrow_right</i>
                    </div>
                })}
            </div>
            <div>
                <label> Absents </label>
                {this.state.absents.map(usr => {
                    return <div>
                        
                        <i className='material-icons' onClick={() => {this.setPresent({id: this.props.id, user: usr._id})}}>keyboard_arrow_left</i>
                        <label>{usr && (usr.prenom + ' ' + usr.nom)}</label>
                    </div>
                })}
            </div>
        </div>
        );
    }
});
