import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import moment from 'moment';
import userHelper from 'focus-core/user';
import confirm from 'focus-core/application/confirm';
import {translate} from 'focus-core/translation';

export default React.createClass({
    displayName: 'NewsPanel',
    /** @inheritDoc */
    render() {
        var limitString = this.props.data.limite ?  '/' + this.props.data.limite : '';
        return (
        <div className={'rbc-event ' + this.props.data.typeEvenement.code }>
                <div>
                    {this.props.data.typeEvenement.name + ' ' + this.props.data.name}
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
