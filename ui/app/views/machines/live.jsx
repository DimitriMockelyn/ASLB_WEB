import React from 'react';
import homeServices from '../../services/home';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import moment from 'moment';
import userHelper from 'focus-core/user';
import confirm from 'focus-core/application/confirm';
import {keys} from 'lodash/object';
import TileMachine from './tile-machine';
import {translate} from 'focus-core/translation';

export default React.createClass({
    displayName: 'PartenairesView',
    getInitialState() {
        return {data: []}
    },
    componentWillMount() {
        this.loadMachinesForDay(moment());
        setInterval(() => {
            this.loadMachinesForDay(moment());
        }, 60000);
    },
    loadMachinesForDay(date) {
        const year = date.get('year');
        const month = date.get('month')+1;  // 0 to 11
        const day = date.get('date');
        homeServices.loadMachinesForDay({day, month, year}).then(res => {
            this.setState({data: this.computeCreneaux(res)});
        })
    },
    computeCreneaux(creneaux) {
        let data = [];

        creneaux.map( creneau => {
            const dateDebut = moment(creneau.dateDebut);
            const dateFin = dateDebut.clone().add(30,'minutes');
            if (moment().isAfter(dateDebut) && moment().isBefore(dateFin)) {
                data.push(creneau);
            }
        });
        return data;
    },
    /** @inheritDoc */
    render() {
        moment.locale('fr');
        return (
        <div>
            <div className='array-like horaires-salle'>
                {moment().format('HH:mm')}
            </div>
            <div data-focus='big-tiles-monitoring'>
                {this.state.data.map(cren => {
                    return <div>
                            <div>{cren.machine.nom}</div>
                            <div>{cren.membre ? cren.membre.prenom + ' ' + cren.membre.nom : 'Libre'}</div>
                        </div>
                })}
            </div>
        </div>
        );
    }
});
