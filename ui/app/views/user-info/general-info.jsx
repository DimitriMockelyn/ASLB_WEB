import React from 'react';
import profileServices from '../../services/profile';
import moment from 'moment';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell} from 'recharts';

import agendaService from '../../services/agenda';
import Ribbon from '../../components/ribbon';
import {navigate} from 'focus-core/history';
import userHelper from 'focus-core/user';

import {component as Popin} from 'focus-components/application/popin';
import UserRibbonSelect from './user-ribbon-select';
import InfosBadges from './infos-badges';

const CustomTooltip  = React.createClass({
  
    render() {
      const { active } = this.props;
      if (active) {
        const { payload, label } = this.props;
        return (
          <div className="custom-tooltip">
            <p className="label">{`${this.props.order[label].name} : ${payload[0] ? payload[0].value : 0}`}</p>
          </div>
        );
      }
  
      return null;
    }
  });

export default React.createClass({
    displayName: 'PartenairesView',
    getInitialState() {
       return {id: this.props.id};
    },
    componentWillMount() {
        agendaService.loadTypeEvenements().then((types) => {
            this.setState({typeEvenements: types});
            profileServices.getInfoGenerales(this.props.id).then((res) => {
                this.setState(res);
            })
            profileServices.getRibbon(this.props.id).then((res) => {

                this.setState({ribbon: undefined, ...res});
            })
        })
    },
    getInitialState() {
        return {};
    },
    computeEvent30j() {
        let res = [];
        this.state.evenementsPasses.map(event => {
            if (moment().diff(event.date_debut,'days') < 31) {
                res.push(event);
            }
        })
        return res;
    },
    renderTooltip(data) {
        return 'abc';
    },
    computeDataBar(evenements) {
        if (!evenements) {
            return [];
        }
        let res = [];
        this.state.typeEvenements.map(typeEvt => {
            res.push({name: typeEvt.name, count: 0, color: typeEvt.color ||'#8884d8' });
        })
        evenements.map(evt => {
            res.map((resultItem, index) => {
                if (evt.typeEvenement && resultItem.name === evt.typeEvenement.name) {
                    res[index].count = res[index].count+1;
                }
            })
        })
        return res.filter(item => {
            return item.count  > 0;
        });
    },
    togglePopinRibbon() {
        this.setState({togglePopinRibbon: true});
    },
    reloadRibbon() {
        profileServices.getRibbon(this.props.id).then((res) => {
            
            this.setState({ribbon: undefined, ...res});
        })
    },
    /** @inheritDoc */
    render() {
        var evenements30j = undefined;
        if (this.state.evenementsPasses) {
            evenements30j = this.computeEvent30j();
        }
        const data30j = this.computeDataBar(evenements30j);
        const dataTot = this.computeDataBar(this.state.evenementsPasses);
        
        return (
            <div data-focus='general-info'>
                {this.state.ribbon && <Ribbon {...this.state.ribbon} />}
                <div data-focus='top-name'>
                    <label>{this.state.prenom + ' ' + this.state.nom} 
                    {userHelper.getLogin() && userHelper.getLogin()._id === this.props.id && 
                        <i className='material-icons edit-icon' title='Modifier mes informations' onClick={() => {navigate('me', true)}}>edit</i>
                    }
                    {userHelper.getLogin() && userHelper.getLogin()._id === this.props.id && 
                        <i className='material-icons edit-icon' title='Modifier mon ruban' onClick={this.props.togglePopinRibbon}>fitness_center</i>
                    }
                    </label>
                    
                    <div data-focus='picture'>
                        <div data-focus='bar' />
                    {!this.state.avatar &&<i className='material-icons'>person</i>}
                    {this.state.avatar && <img  src={'data:image/png;base64,'+this.state.avatar} />}
                    
                    </div>
                </div>
                <div data-focus='info-membre'>
                    <div data-focus='info-nominatives'>
                        {this.state.sexe && <label>{this.state.sexe.label}</label>} 
                        {this.state.dateNaissance && <label> {moment().diff(this.state.dateNaissance, 'years')+ ' ans'} </label>}
                        {this.state.entreprise && <label>{this.state.entreprise.label}</label>} 
                    </div>
                    <div data-focus='info-nominatives'>
                        {this.state.date_creation && <label>{'Membre depuis le '+moment(this.state.date_creation).format('DD/MM/YYYY')}</label>}
                        {this.state.numero && <label>n° {this.state.numero}</label>}
                    </div>
                    <div data-focus='bar' />
                </div>
                <div>
                    <InfosBadges id={this.props.id} />
                </div>
                <div data-focus='info-historique'>
                    <div data-focus='historique-30j'>
                        {evenements30j && <label>{evenements30j.length + ' activités dans les 30 derniers jours'}</label>}
                        {data30j && data30j.length > 0 && <BarChart width={150} height={100} data={data30j} fill='#00000000'>

                            <Tooltip content={<CustomTooltip order={this.state.typeEvenements}/>}/>
                            <Bar dataKey="count">
                            {
              data30j.map((entry, index) => {

                return <Cell cursor="pointer" fill={entry.color } key={`cell-${index}`}/>;
              })
            }
                                </Bar>
                        </BarChart>}
                    </div>
                    <div data-focus='history-all-time'>
                        {this.state.evenementsPasses && <label>{this.state.evenementsPasses.length + ' activités au total'}</label>}
                        {dataTot && dataTot.length > 0 &&<BarChart width={150} height={100} data={dataTot} fill='#00000000'>

                            <Tooltip content={<CustomTooltip order={this.state.typeEvenements}/>}/>
                            <Bar dataKey="count">
                            {
              dataTot.map((entry, index) => {

                return <Cell cursor="pointer" fill={entry.color } key={`cell-${index}`}/>;
              })
            }
                                </Bar>
                        </BarChart>}
                    </div>
                </div>
            </div>
        );
    }
});
