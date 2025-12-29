import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
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
                <Button type='button' label='button.edit' handleOnClick={() => {this.props.editAction(this.props.value)}}/>
                <Button type='button' label='button.remove' handleOnClick={() => {
                    confirm(i18n.t('confirmDelete.presentation')).then(
                        () => {this.props.deleteAction(this.props.value)}
                    )}}/>
            </div>
        }
    },
    render() {
        return (
        <div data-focus='panel-into-panel'>
            <div data-focus='presentation-personne'>
                    <div data-focus='title' onClick={() => {this.setState({toggled: !this.state.toggled})}}>
                        <label>{this.props.value.name}</label>
                        {this.props.value.isBureau  &&<i className='material-icons'> wb_iridescent</i>}
                        <i className='material-icons'>{this.state.toggled ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
                        {this.renderActionsEdit()}
                    </div>
                    {this.state.toggled && <div data-focus='presentation-box'>
                        <label>{i18n.t('contact.presentationTitre')}</label>
                        {this.props.value.image && <img src={this.props.value.image} alt={this.props.value.name}/>}
                        <div data-focus='interview'>
                            <div dangerouslySetInnerHTML={{ __html: this.props.value.description }} />
                        </div>
                    </div>}
                </div>     
        </div>
        );
    }
});
