import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import moment from 'moment';
import userHelper from 'focus-core/user';
import userServices from '../../services/user';
import {component as Popin} from 'focus-components/application/popin';
import message from 'focus-core/message';

export default React.createClass({
    displayName: 'HomeView',
    mixins: [formMixin],
    definitionPath: 'person',
    action: {},
    
    referenceNames: ['typeSexe', 'typeEntreprise'],
    saveEmpty() {
        return;
    },
    componentWillMount() {
        this.action['save'] = this.saveEmpty;
    },
    getInitialState() {
        return {tab: 0, password: '', passwordAgain: '', prenom: '', nom: ''};
    },
    connect() {
        if (this._validate()) {
            userServices.connect(this._getEntity()).then((res) => {
                userHelper.setLogin({...userHelper.getLogin(), ...res});
                document.cookie = "tokenJWT=" + res.token;
                window.location.reload();
            }, err => { console.log(err); throw err;});
        }
    },
    create() {
        if (this._validate()) {
            userServices.create(this._getEntity()).then(() => {message.addSuccessMessage(i18n.t('person.createdSuccess'))}, err => { console.log(err); throw err;});
        }
    },
    sendMailReset() {
        if (this._validate()) {
            userServices.sendMailReset(this._getEntity()).then(() => {message.addSuccessMessage(i18n.t('person.mailResetSent'))}, err => { console.log(err); throw err;});
        }
    },
    customValidation() {
        if (this.state.tab === 1) {
            if (this._getEntity().password !== this._getEntity().passwordAgain) {
                this.refs['person.password'].setError(i18n.t('person.badPasswords'));
                this.refs['person.passwordAgain'].setError(i18n.t('person.badPasswords'));
                return false;
            }
        }
        return true;
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <div data-scope='button-bar-compte'>
            <Button label='user.connect' className={this.state.tab === 0 ? 'active' : ''} type='button' handleOnClick={() => {this.setState({tab: 0})} } />
            <Button label='user.create' className={this.state.tab === 1 ? '' : 'active'} type='button' handleOnClick={() => {this.setState({tab: 1})} } />
            <Button label='user.forgot' className={this.state.tab === 2 ? '' : 'active'} type='button' handleOnClick={() => {this.setState({tab: 2})} } />
            </div>
            {this.fieldFor('email', {isEdit: true})}
            {this.state.tab !== 2 && this.fieldFor('password', {isEdit: true, options: { _handleKeyPress: function(e) {
                if (e.key === 'Enter') {
                console.log('do validate');
                }
            }}})}
            {this.state.tab === 1 && this.fieldFor('passwordAgain', {isEdit: true})}
            {this.state.tab === 1 && this.fieldFor('prenom', {isEdit: true})}
            {this.state.tab === 1 && this.fieldFor('nom', {isEdit: true})}
            {this.state.tab === 1 && this.fieldFor('dateNaissance', {isEdit: true})}
            {this.state.tab === 1 && this.fieldFor('sexe', {isEdit: true, listName: 'typeSexe', valueKey: '_id', isRequired: true})}
            {this.state.tab === 1 && this.fieldFor('entreprise', {isEdit: true, listName: 'typeEntreprise', valueKey: '_id', isRequired: true})}
            {this.state.tab === 1 && this.fieldFor('telephone', {isEdit: true})}
            {this.state.tab === 0 && <Button label='user.connexion' handleOnClick={this.connect} />}
            {this.state.tab === 1 && <Button label='user.creation' type='button' handleOnClick={this.create} />}
            {this.state.tab === 2 && <Button label='user.reset' type='button' handleOnClick={this.sendMailReset} />}
        </div>
        );
    }
});
