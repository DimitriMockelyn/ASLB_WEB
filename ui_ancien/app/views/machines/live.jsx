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

        this.incrementCounter();
        setInterval(() => {
            this.incrementCounter();
        }, 4000);
    },
    incrementCounter() {
        if (!this.state.showData) {
            this.setState({showData: 1})
        } else {
            var newData = (this.state.showData+1)
            if (newData > 3) {
                newData = 1;
            }
            this.setState({showData: newData})
        }
    },
    loadMachinesForDay(date) {
        const year = date.get('year');
        const month = date.get('month')+1;  // 0 to 11
        const day = date.get('date');
        homeServices.loadMachinesForDay({day, month, year}).then(res => {
            this.setState(this.computeCreneaux(res));
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
		data.sort(function (a,b) {
				if(a.machine.nom < b.machine.nom) {
					return -1;
				}
				if(a.machine.nom > b.machine.nom) {
					return 1;
				}
				return 0;
			});
            //data2
            var start2 = moment().clone().add(30,'minutes');
            var data2 = [];
            creneaux.map( creneau => {
                const dateDebut = moment(creneau.dateDebut);
                const dateFin = dateDebut.clone().add(30,'minutes');
                if (start2.isAfter(dateDebut) && start2.isBefore(dateFin)) {
                    data2.push(creneau);
                }
            });
            data2.sort(function (a,b) {
                    if(a.machine.nom < b.machine.nom) {
                        return -1;
                    }
                    if(a.machine.nom > b.machine.nom) {
                        return 1;
                    }
                    return 0;
                });
                            //data2
            var start3 = moment().clone().add(30,'minutes');
            var data3 = [];
            creneaux.map( creneau => {
                const dateDebut = moment(creneau.dateDebut);
                const dateFin = dateDebut.clone().add(30,'minutes');
                if (start3.isAfter(dateDebut) && start3.isBefore(dateFin)) {
                    data3.push(creneau);
                }
            });
            data3.sort(function (a,b) {
                    if(a.machine.nom < b.machine.nom) {
                        return -1;
                    }
                    if(a.machine.nom > b.machine.nom) {
                        return 1;
                    }
                    return 0;
                });
                console.log({"data": data, "data2": data2, "data3": data3})
        return {"data": data, "data2": data2, "data3": data3};
    },
    /** @inheritDoc */
    render() {
        moment.locale('fr');
        return (
        <div>
            <div className='array-like horaires-salle'>
                {moment().format('HH:mm')} 
                {this.state.showData && this.state.showData === 2 && 
                     <span>- Prochain creneau:</span>}
                    {this.state.showData && this.state.showData === 3 && 
                     <span>- Dans une heure:</span>}
            </div>
            
            <div data-focus='big-tiles-monitoring'>
                <div className="show-first">
                {this.state.showData && this.state.showData === 1 && this.state.data &&this.state.data.map(cren => {
                    return <div>
                            <div>{cren.machine.nom}</div>
                            <div>{cren.membre ? cren.membre.prenom + ' ' + cren.membre.nom : 'Libre'}</div>
                        </div>
                })}

                                {this.state.showData && this.state.showData === 2 && this.state.data2 && this.state.data2.map(cren => {
                    return <div>
                            <div>{cren.machine.nom}</div>
                            <div>{cren.membre ? cren.membre.prenom + ' ' + cren.membre.nom : 'Libre'}</div>
                        </div>
                })}

                                {this.state.showData && this.state.showData === 3 &&  this.state.data3 &&this.state.data3.map(cren => {
                    return <div>
                            <div>{cren.machine.nom}</div>
                            <div>{cren.membre ? cren.membre.prenom + ' ' + cren.membre.nom : 'Libre'}</div>
                        </div>
                })}
                </div>
            </div>
        </div>
        );
    }
});
