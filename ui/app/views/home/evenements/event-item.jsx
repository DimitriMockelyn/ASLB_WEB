import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import moment from 'moment';
import userHelper from 'focus-core/user';
import confirm from 'focus-core/application/confirm';
import {translate} from 'focus-core/translation';
import {navigate} from 'focus-core/history';

export default React.createClass({
    displayName: 'NewsPanel',
    onClickTile() {
        let mom = moment().locale('en');
        let momentDebut = moment(this.props.data.date_debut, moment.ISO_8601).locale('en');
        let diff = Math.abs(mom.clone().startOf('week').diff(momentDebut.clone().startOf('week'), 'week'));
        setTimeout(() => {navigate('agenda/'+this.props.data._id+'/'+diff,true)},10)
    },
    onClickActivityTile() {
        let mom = moment().locale('en');
        let momentDebut = moment(this.props.data.dateDebut, moment.ISO_8601).locale('en');
        let diff = Math.abs(mom.clone().startOf('day').diff(momentDebut.clone().startOf('day'), 'day'));
        setTimeout(() => {navigate('activites/'+this.props.data._id+'/'+diff,true)},10)
    },
    /** @inheritDoc */
    render() {
        var limitString = this.props.data.limite ?  '/' + this.props.data.limite : '';
        if (this.props.data.activity) {
            return (
            <div className={'rbc-event event-caroussel '} onClick={this.onClickActivityTile}>
            <div>
                {(this.props.data.activity ?  this.props.data.activity.nom : '') + ' - ' + (this.props.data.title || '')}
            </div>
            <div>{moment(this.props.data.dateDebut, moment.ISO_8601).format('DD/MM/YYYY - HH:mm') }</div>
            <div>{translate('event.nbInscrits') + ' ' +this.props.data.participants.length + limitString} </div>
    </div>
    );
        }
        return (
        <div className={'rbc-event event-caroussel ' + (this.props.data.typeEvenement ? this.props.data.typeEvenement.code : '') + (!this.props.data.tokenConsumer ? ' gratuit ' : '') } onClick={this.onClickTile}>
                <div>
                    {(this.props.data.typeEvenement ?  this.props.data.typeEvenement.name : '') + ' - ' + this.props.data.name}
                </div>
                <div>{moment(this.props.data.date_debut, moment.ISO_8601).format('DD/MM/YYYY - HH:mm') }</div>
                <div>
                     {this.props.data.duree + ' ' + translate('event.minutes')}
                </div>
                     <div>{translate('event.nbInscrits') + ' ' +this.props.data.participants.length + limitString} </div>
        </div>
        );
    }
});
