import React from 'react';
import profileServices from '../../services/profile';
import moment from 'moment';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell} from 'recharts';

import agendaService from '../../services/agenda';
import Ribbon from './ribbon';

const CustomTooltip  = React.createClass({
  
    render() {
      const { active } = this.props;
        console.log(this.props);
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
        console.log('data', data);
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
                if (resultItem.name === evt.typeEvenement.name) {
                    res[index].count = res[index].count+1;
                }
            })
        })
        return res;
    },
    /** @inheritDoc */
    render() {
        var evenements30j = undefined;
        if (this.state.evenementsPasses) {
            evenements30j = this.computeEvent30j();
        }
        const data30j = this.computeDataBar(evenements30j);
        const dataTot = this.computeDataBar(this.state.evenementsPasses);
        /* [
            {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
            {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
            {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
            {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
            {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
            {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
            {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
      ];*/
        
        return (
            <div data-focus='general-info'>
                <Ribbon />
                <div data-focus='top-name'>
                    <label>{this.state.prenom + ' ' + this.state.nom}</label>
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
                    <div>
                        {this.state.date_creation && <label>{'Membre depuis le '+moment(this.state.date_creation).format('DD/MM/YYYY')}</label>}
                    </div>
                    <div data-focus='bar' />
                </div>
                <div data-focus='info-historique'>
                    <div data-focus='historique-30j'>
                        {evenements30j && <label>{evenements30j.length + ' activités dans les 30 derniers jours'}</label>}
                        <BarChart width={150} height={100} data={data30j}>

                            <Tooltip content={<CustomTooltip order={this.state.typeEvenements}/>}/>
                            <Bar dataKey="count">
                            {
              data30j.map((entry, index) => {
                  console.log(entry);

                return <Cell cursor="pointer" fill={entry.color } key={`cell-${index}`}/>;
              })
            }
                                </Bar>
                        </BarChart>
                    </div>
                    <div data-focus='history-all-time'>
                        {this.state.evenementsPasses && <label>{this.state.evenementsPasses.length + ' activités au total'}</label>}
                        <BarChart width={150} height={100} data={dataTot}>

                            <Tooltip content={<CustomTooltip order={this.state.typeEvenements}/>}/>
                            <Bar dataKey="count">
                            {
              dataTot.map((entry, index) => {

                return <Cell cursor="pointer" fill={entry.color } key={`cell-${index}`}/>;
              })
            }
                                </Bar>
                        </BarChart>
                    </div>
                </div>
            </div>
        );
    }
});
