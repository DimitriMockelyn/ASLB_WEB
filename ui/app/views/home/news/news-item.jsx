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
        return (
        <div data-focus='panel-into-panel'>
            <Panel title={this.props.data.titre}>
                <div className='news-content' dangerouslySetInnerHTML={{ __html: this.props.data.content }} />

                <div data-focus='news-info'>
                    <div>{i18n.t('admin.newsCreatedBy') + ' ' + this.props.data.createur.nom + ' ' + this.props.data.createur.prenom + ' ' + i18n.t('admin.newsCreatedAt') + ' ' + moment(this.props.data.date, moment.ISO_8601).format('DD/MM/YYYY - HH:mm')}</div>
                </div>
            </Panel>
        </div>
        );
    }
});
