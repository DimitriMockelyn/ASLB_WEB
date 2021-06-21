import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import moment from 'moment';
import userHelper from 'focus-core/user';
import confirm from 'focus-core/application/confirm';

export default React.createClass({
    displayName: 'PartenairePanel',
    /** @inheritDoc */
    renderActionsEdit() {
        if (!this.props.hideButtons) {
            return <div>
                <Button type='button' label='button.edit' handleOnClick={() => {this.props.editAction(this.props.value)}}/>
                <Button type='button' label='button.remove' handleOnClick={() => {
                    confirm(i18n.t('confirmDelete.dayOff')).then(
                        () => {this.props.deleteAction(this.props.value)}
                    )}}/>
            </div>
        }
    },
    render() {
        return (
        <div data-focus='panel-into-panel'>
            <Panel title={(this.props.value.jour + ' - ' + this.props.value.heureDebut + ' - ' + this.props.value.heureFin)} actions={this.renderActionsEdit} data-spy={undefined} >
                {this.props.value.activitesTimeType && this.props.value.activitesTimeType.map(actType => {
                    
                    return this.props.acts.map( elt => {
                        if (actType === elt._id) {
                            return <div>{elt.nom}</div>;
                        }
                    })
                        
                })}
            </Panel>
        </div>
        );
    }
});
