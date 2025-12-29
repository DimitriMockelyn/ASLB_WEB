import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import moment from 'moment';
import userHelper from 'focus-core/user';
import confirm from 'focus-core/application/confirm';

export default React.createClass({
    displayName: 'NewsPanel',
    /** @inheritDoc */
    render() {
        var limitString = this.props.data.limite ?  '/' + this.props.data.limite : '';
        return (
        <div data-focus='panel-into-panel'>
            <Panel title={(this.props.data.typeEvenement ? this.props.data.typeEvenement.name : '') + ' - ' + this.props.data.name}>
                <div>
                    {this.props.data.description}
                </div>
                

                <div data-focus='news-info'>
                    <div>{i18n.t('admin.eventAt') + ' ' + moment(this.props.data.date_debut, moment.ISO_8601).format('DD/MM/YYYY - HH:mm') + ' - ' +
                     i18n.t('event.duree') + ' ' + this.props.data.duree + ' - ' +
                     i18n.t('admin.nbInscrits') + ' ' + this.props.data.participants.length + limitString} </div>
                </div>
            </Panel>
        </div>
        );
    }
});
