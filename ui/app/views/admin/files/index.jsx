import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import React from 'react';
import { navigate, views } from 'react-big-calendar/lib/utils/constants';
import fetch from '../../../utils/fetch';
import {mixin as formMixin} from 'focus-components/common/form';
import builder from 'focus-core/util/url/builder';
import {component as Popin} from 'focus-components/application/popin';
import adminServices from '../../../services/admin';
import homeServices from '../../../services/home';
import FileUpload from '../../../components/file-upload';
import userHelper from 'focus-core/user';
import {component as Button} from 'focus-components/common/button/action';
import Toggle from 'focus-components/components/input/toggle';
import message from 'focus-core/message';

import Panel from 'focus-components/components/panel';
import {getConfig} from '../../../config';
const root = getConfig().API_ROOT;
export default React.createClass({
    displayName: 'NewsView',
    mixins: [formMixin],
    definitionPath: 'admin',
    getInitialState() {
        return {
        }
    },
    componentWillMount() {
        adminServices.listFiles().then(res => {
            this.setState({files: res.files});
        })
    },
    
    /** @inheritDoc */
    renderContent() {
        return (
        <Panel  title='Fichiers'>
                Fichiers disponibles :
        <div style={{'max-height':'150px', 'overflow': 'auto'}}>

            {this.state.files && this.state.files.map(file => {
                return <div>{window.location.origin + window.location.pathname+'fichiers/'+file}</div>
            })}
            </div>
            <Button type='button' label='admin.uploadFile' handleOnClick={() => {this.refs.upload.refs.focusFile.dropzone.hiddenFileInput.click()}}/>
            <div style={{'display': 'none'}}>
                <FileUpload ref='upload' onFileSuccess={() => {message.addSuccessMessage(i18n.t('admin.fileUploaded'))}} url={root + 'uploadFile'}/>
            </div>
            <Button type='button' label='admin.uploadFileInscription' handleOnClick={() => {this.refs.uploadInscription.refs.focusFile.dropzone.hiddenFileInput.click()}}/>
            <div style={{'display': 'none'}}>
                <FileUpload ref='uploadInscription' onFileSuccess={() => {message.addSuccessMessage(i18n.t('admin.fileUploaded'))}} url={root + 'uploadFileInscription'}/>
            </div>
        </Panel>
        );
    }
});
