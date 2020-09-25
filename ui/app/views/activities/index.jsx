import React from 'react';
import homeServices from '../../services/home';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import moment from 'moment';
import userHelper from 'focus-core/user';
import confirm from 'focus-core/application/confirm';
import {keys} from 'lodash/object';
import TileActivity from './tile-activity';
import {translate} from 'focus-core/translation';
import {navigate} from 'focus-core/history';

export default React.createClass({
    displayName: 'ActivityView',
    getInitialState() {
        if (this.props.dateDiff) {
            return {currentDate: moment().add(parseInt(this.props.dateDiff, 10), 'days')}
        }
        return {currentDate: moment()}
    },
    componentWillMount() {
        this.loadActivitesForDay(this.state.currentDate, this.props.creneauId);
    },
    loadActivitesForDay(date, creneauId) {
        const year = date.get('year');
        const month = date.get('month')+1;  // 0 to 11
        const day = date.get('date');
        return homeServices.loadActivitesForDay({day, month, year}).then(res => {
            this.setState({creneaux: this.computeCreneaux(res), toOpen: creneauId});
        })
    },
    computeCreneaux(creneaux) {
        let data = {};
        creneaux.map( creneaux => {
            if (creneaux.activity) {
            if (!data[creneaux.activity.nom]) {
                    data[creneaux.activity.nom] = [];
                }
                data[creneaux.activity.nom].push(creneaux);
            }
        });
        for (let index in data) {
            data[index].sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return moment(a.dateDebut).diff(moment(b.dateDebut));
            });
        }
        return data;
    },
    addDay(futur) {
        let daysToAdd = futur ? 1 : -1;
        let currentDate=  this.state.currentDate;
        if (currentDate.day() === 1 && daysToAdd === -1) {
            daysToAdd = -3;
        }
        if (currentDate.day() === 5 && daysToAdd === 1) {
            daysToAdd = 3;
        }
        currentDate.add(daysToAdd, 'day');
        this.setState({currentDate: currentDate}, () => {this.loadActivitesForDay(currentDate)});
    },
    /** @inheritDoc */
    render() {
        moment.locale('fr');
		let activityName = [];
		if (this.state.creneaux && keys(this.state.creneaux).length > 0) {
			activityName = keys(this.state.creneaux);
			activityName.sort(function (a,b) {
				if(a < b) {
					return -1;
				}
				if(a > b) {
					return 1;
				}
				return 0;
			});
		}
        return (
        <div>
            {translate('activities.warning')}
            <div data-focus='display-row' style={{'justify-content':'space-around', 'width': '100%', 'margin-bottom': '30px', 'margin-top': '30px'}}>
                <Button label='<<' type='button' style='' handleOnClick={() => {this.addDay(false)}} />
                <div data-focus='display-row'>
                    <div style={{'marginRight':'100px'}}>
                        {moment.weekdaysShort()[(this.state.currentDate.day())%7]  + ' ' + this.state.currentDate.get('date') + ' ' + moment.monthsShort()[this.state.currentDate.month()]}
                    </div>
                </div>
                <Button label='>>' type='button' style='' handleOnClick={() => {this.addDay(true)}} />
            </div>
            <div data-focus='display-row' style={{'width':'100%'}}>
                <div data-focus='display-column' className='array-like' style={{'width': 'auto'}}>
                    <div>Heure</div>
                    {this.state.creneaux && keys(this.state.creneaux).length > 0 && this.state.creneaux[keys(this.state.creneaux)[0]].map(cren => {
                    return <div data-focus='tile-machine' style={{'width': 'auto', "height":"0px",
                            'padding-top': '0px',
                            'padding-bottom': '0px',
                            'margin-top': '0',
                            'margin-bottom': '0',
                            'overflow': 'hidden'}}>
                            {moment(cren.dateDebut).format('HH:mm')}
                        </div>
                })}
                </div>
                {activityName.length > 0 && activityName.map((keyName, indexName) => {
                    let obj = this.state.creneaux[keyName];
                    let index = keyName;

                    return <div data-focus='display-column' className='array-like'>
                        <div>
                            {index}
                        </div>
                </div>})}
            </div>
            <div data-focus='display-row' className='machine-scroll' style={{'width':'100%'}}>
                <div data-focus='display-column' className='array-like' style={{'width': 'auto'}}>
                {this.state.creneaux && keys(this.state.creneaux).length > 0 && this.state.creneaux[keys(this.state.creneaux)[0]].map(cren => {
                    return <div data-focus='tile-machine' style={{'width': 'auto'}}>
                            {moment(cren.dateDebut).format('HH:mm')}
                        </div>
                })}
                </div>
                {activityName.length > 0 && activityName.map((keyName, indexName) => {
                    let obj = this.state.creneaux[keyName];
                    let index = keyName;

                    return <div data-focus='display-column' className='array-like'>
                        {obj.map(creneau => {
                            
                            return <TileActivity data={creneau} onRefresh={this.componentWillMount.bind(this)} toOpen={creneau._id === this.state.toOpen}/>
                        })}
                    </div>
                })}
            </div>
        </div>
        );
    }
});
