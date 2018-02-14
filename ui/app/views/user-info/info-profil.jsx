import React from 'react';
import profileServices from '../../services/profile';
import moment from 'moment';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell} from 'recharts';

import agendaService from '../../services/agenda';
import {navigate} from 'focus-core/history';
import userHelper from 'focus-core/user';

export default React.createClass({
    displayName: 'PartenairesView',
    getInitialState() {
       return {id: this.props.id};
    },
    componentWillMount() {
        agendaService.loadTypeEvenements().then((types) => {
            this.setState({typeEvenements: types});
            profileServices.getInfoProfil(this.props.id).then((res) => {
                this.setState(res);
            })
        });
    },
    getInitialState() {
        return {profil: {}};
    },
    computeLabel(id, listName) {
        if (!id || !this.state.typeEvenements) {
            return '';
        }

        return (this.state.typeEvenements.find(data => { return data._id === id}) || {name: ''}).name;
    },
    /** @inheritDoc */
    render() {
       
        
        return (
            <div data-focus='info-profil'>
               <div>
                   <div dangerouslySetInnerHTML={{__html: this.state.profil.description}} />
                </div>
                <div>
                    <div dangerouslySetInnerHTML={{__html: this.state.profil.raisonSport}} />
                </div>
                <div>
                    <div dangerouslySetInnerHTML={{__html: this.state.profil.records}} />
                </div>
                <div>
                    {this.state.profil.activitesVoulues && this.state.profil.activitesVoulues.map(id => {
                        return <div>{this.computeLabel(id)}</div>;
                    })}
                </div>
            </div>
        );
    }
});
