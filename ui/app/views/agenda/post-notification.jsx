import React from 'react';
import agendaServices from '../../services/agenda';

import {mixin as formMixin} from 'focus-components/common/form';

import {component as Button} from 'focus-components/common/button/action';
import message from 'focus-core/message';
import {component as Popin} from 'focus-components/application/popin';
export default React.createClass({
    displayName: 'PostNotificationView',
    mixins: [formMixin],
    definitionPath: 'event',
    postNotification() {
        if (this._validate()) {
            agendaServices.sendPostNotif({data: this._getEntity(), id: this.props.id}).then(() => {
                message.addSuccessMessage(i18n.t('event.notificationPoste'))
                this.props.onPopinClose();
            });
        }
    },
    
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            
            {this.fieldFor('notifText', {isEdit: true, isRequired: true})}
            
            <Button label={'event.sendNotification'} type='button' handleOnClick={this.postNotification} />

            
        </div>
        );
    }
});
