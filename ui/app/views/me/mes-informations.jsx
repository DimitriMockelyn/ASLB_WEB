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
    displayName: 'MesInformationsView',
    mixins: [formMixin],
    definitionPath: 'person',
    referenceNames: ['typeSexe', 'typeEntreprise'], 
    componentWillMount() {
        userServices.loadMesInformations().then(res => {this.setState(res)});
    },
    getInitialState() {
        return {...this.props.data};
    },
    create() {
        if (this.validate()) {
            let data = this._getEntity();
            if (this.state._id) {
                adminServices.editPartenaire({ ...data, id: this.state._id}).then(this.props.onPopinClose);
            } else {
                adminServices.createPartenaire(data).then(this.props.onPopinClose);
            }
        }
    },
    buttonSaveCst() {
        const { isLoading } = this.state;
        const handleOnClick = () => {
            this.clearError();
            if (this._validate()) {
                var emailChanged = this._getEntity().email !== this.state.email;
                userServices.updateMesInformations({...this._getEntity(),avatar:undefined}).then((res) => {
                    this.setState({...res, isEdit: false});
                    message.addSuccessMessage(i18n.t('detail.saved'));
                    if (emailChanged) {
                        userServices.disconnect();
                        navigate('/', false);
                        window.location.reload();
                    } else {
                        window.location.reload();
                    }
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
            <Panel title='person.mesInformations' actions={this._renderActions}>
                {this.fieldFor('prenom')}
                {this.fieldFor('nom')}
                <label>{i18n.t('person.changeEmailWarning')}</label>
                {this.fieldFor('email')}
                {this.fieldFor('dateNaissance')}
                {this.fieldFor('sexe', {listName: 'typeSexe', valueKey: '_id', isRequired: true})}
                {this.fieldFor('entreprise', {listName: 'typeEntreprise', valueKey: '_id', isRequired: true})}
                {this.fieldFor('telephone')}
                <Button type='button' label='person.changeAvatar' handleOnClick={() => {this.refs.upload.refs.focusFile.dropzone.hiddenFileInput.click()}}/>
                <div style={{'display': 'none'}}>
                    <FileUpload ref='upload' onFileSuccess={() => {window.location.reload()}} url={root + 'uploadAvatar'}/>
                </div>
            </Panel>
        </div>
        );
    }
});
