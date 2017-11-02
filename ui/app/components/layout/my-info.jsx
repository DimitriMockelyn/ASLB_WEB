//libraries
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import userHelper from 'focus-core/user';
import moment from 'moment';
import FileUpload from '../file-upload';
import {getConfig} from '../../config';
import {component as Button} from 'focus-components/common/button/action';
const root = getConfig().API_ROOT;
export default React.createClass({
    render() {
        var me = userHelper.getLogin();
        return <div data-focus='me-panel'>
            <label>{me.prenom + ' '+ me.nom + ' (' + me.email + ')'}</label>
            {me.date_activation && <label>{i18n.t('person.adherentDepuis') + ' ' + moment(me.date_activation, moment.ISO_8601).format('DD/MM/YYYY')}</label>}
            {!me.date_activation && <label>{i18n.t('person.nonAdherent')}</label>}
            <Button type='button' label='person.changeAvatar' handleOnClick={() => {this.refs.upload.refs.focusFile.dropzone.hiddenFileInput.click()}}/>
            <div style={{'display': 'none'}}>
                <FileUpload ref='upload' onFileSuccess={() => {window.location.reload()}} url={root + 'uploadAvatar'}/>
            </div>
        </div>
    }
});
