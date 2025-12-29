import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import userServices from '../../services/user';
import moment from 'moment';
import userHelper from 'focus-core/user';
import message from 'focus-core/message';
import {navigate} from 'focus-core/history';
import FileUpload from '../../components/file-upload';
import {getConfig} from '../../config';
const root = getConfig().API_ROOT;
export default React.createClass({
    displayName: 'MonProfilView',
    mixins: [formMixin],
    definitionPath: 'person',
    referenceNames: ['typeEvenements'], 
    componentWillMount() {
        userServices.loadMonProfil().then(res => {this.setState(res)});
    },
    getInitialState() {
        return {...this.props.data, activitesVoulues: []};
    },
    buttonSaveCst() {
        const { isLoading } = this.state;
        const handleOnClick = () => {
            this.clearError();
            if (this._validate()) {
                var emailChanged = this._getEntity().email !== this.state.email;
                userServices.updateMonProfil({...this._getEntity()}).then((res) => {
                    this.setState({...res, isEdit: false});
                    message.addSuccessMessage(i18n.t('detail.saved'));
                });
            }
        };
        return (
            <Button
                handleOnClick={handleOnClick}
                icon='save'
                label='button.save'
                shape={null}
                type='button'
                isLoading={isLoading}
                processLabel='button.saving'
            />
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
            <Panel title='person.monProfil' actions={this._renderActions}>
                {this.fieldFor('description', {labelSize: 12, contentSize: 12})}
                {this.fieldFor('raisonSport', {labelSize: 12, contentSize: 12})}
                {this.fieldFor('activitesVoulues', {labelSize: 12, contentSize: 12, options: {list: this.state.reference && this.state.reference.typeEvenements}})}
                {this.fieldFor('autreActivites', {labelSize: 12, contentSize: 12})}
                {this.fieldFor('records', {labelSize: 12, contentSize: 12})}
            </Panel>
        </div>
        );
    }
});
