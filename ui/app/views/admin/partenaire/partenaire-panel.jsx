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
            return <Button type='button' label='button.edit' handleOnClick={() => {this.props.editAction(this.props.value)}}/>
        }
    },
    render() {
        return (
        <div data-focus='panel-into-panel'>
            <Panel title={this.props.value.name} actions={this.renderActionsEdit} data-spy={undefined} >
                {this.props.value.logo && <img src={this.props.value.logo} alt={this.props.value.name}/>}
                <div dangerouslySetInnerHTML={{ __html: this.props.value.description }} />
            </Panel>
        </div>
        );
    }
});
