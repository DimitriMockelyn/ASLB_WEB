import React from 'react';
import Panel from 'focus-components/components/panel';
import { mixin as formMixin } from 'focus-components/common/form';
import { component as Button } from 'focus-components/common/button/action';
import moment from 'moment';
import userHelper from 'focus-core/user';
import confirm from 'focus-core/application/confirm';

export default React.createClass({
    displayName: 'PartenairePanel',
    getInitialState() {
        return {}
    },
    /** @inheritDoc */
    renderActionsEdit() {
        if (!this.props.hideButtons) {
            return <div>
                <Button type='button' label='button.edit' handleOnClick={() => { this.props.editAction(this.props.value) }} />
            </div>
        }
    },
    render() {
        return (
            <div data-focus='panel-into-panel'>
                <div data-focus='badges-line'>
                    <div className={'badge-info-line '+this.props.value.code}>
                        <div data-focus='round-line'>
                            <div>
                                <div className={this.props.value.code} />
                                <Button type='button' label='button.edit' shape='icon' icon='edit' handleOnClick={() => { this.props.editAction(this.props.value) }} />
                            </div>
                        </div>
                        <div className='desc-line'>
                            <div className='title'>
                                {this.props.value.titre}
                            </div>
                            <div className='description'>
                                {this.props.value.description} 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
