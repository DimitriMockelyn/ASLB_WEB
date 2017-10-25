import React from 'react';
import userServices from '../../services/user';
import {mixin as formMixin} from 'focus-components/common/form';
import message from 'focus-core/message';

export default React.createClass({
    displayName: 'ChangePasswordView',
    mixins: [formMixin],
    definitionPath: 'person',
    componentWillMount() {
        this.setState({});
    },
    changePassword() {
        userServices.changePassword({...this._getEntity(), code: this.props.code}).then(() => {message.addSuccessMessage(i18n.t('person.passwordReseted'))}, err => { console.log(err); throw err;});
    },
    customValidation() {
        if (!this.state.connect) {
            if (this._getEntity().password !== this._getEntity().passwordAgain) {
                this.refs['person.password'].setError(i18n.t('person.badPasswords'));
                this.refs['person.passwordAgain'].setError(i18n.t('person.badPasswords'));
            }
        }
        return true;
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            {this.state.changed === undefined && <div>
                <label>{i18n.t('person.confirmResetPassword')}</label>
                {this.fieldFor('password', {isEdit: true})}
                {this.fieldFor('passwordAgain', {isEdit: true})}
            </div>}
            {this.state.changed === true && <div>{i18n.t('user.changed')}</div>}
            {this.state.changed === false && <div>{i18n.t('user.notChanged')}</div>}
        </div>
        );
    }
});
