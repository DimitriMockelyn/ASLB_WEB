import React from 'react';
import userServices from '../../services/user';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import message from 'focus-core/message';
import Panel from 'focus-components/components/panel';
export default React.createClass({
    displayName: 'ChangePasswordView',
    mixins: [formMixin],
    definitionPath: 'person',
    componentWillMount() {
        this.setState({});
    },
    changePassword() {
        if (this._validate()) {
            userServices.changePasswordConnecte({...this._getEntity()}).then((res) => {
                if (res.changed) {
                    message.addSuccessMessage(i18n.t('person.passwordReseted'))
                    this.setState({isEdit: false});
                }
            }, err => { console.log(err); throw err;});
        }
    },
    customValidation() {
        if (this._getEntity().password !== this._getEntity().passwordAgain) {
            this.refs['person.password'].setError(i18n.t('person.badPasswords'));
            this.refs['person.passwordAgain'].setError(i18n.t('person.badPasswords'));
            return false;
        }
        return true;
    },
    buttonSaveCst() {
        return (
            <Button label='user.performReset' type='button' icon='save' shape='' handleOnClick={this.changePassword} />
        );
    },
    buttonCancelCst() {
        const handleOnClick = () => {
            this.clearError();
            this.setState({...this.state, isEdit: false})
        }
        return (
            <Button
                handleOnClick={handleOnClick}
                icon='undo'
                label='button.cancel'
                shape={null}
                type='button'
            />
        );
    },
    renderEditActions() {
        return <span>
            {this.buttonSaveCst()}
            {this.buttonCancelCst()}
        </span>
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <Panel title='person.changePassword' actions={this._renderActions}>
                <label>{i18n.t('person.confirmResetPassword')}</label>
                {this.fieldFor('password')}
                {this.fieldFor('passwordAgain')}
                
            </Panel>
        </div>
        );
    }
});
