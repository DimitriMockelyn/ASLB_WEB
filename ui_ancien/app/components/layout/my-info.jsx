//libraries
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import userHelper from 'focus-core/user';
import moment from 'moment';
import FileUpload from '../file-upload';
import {getConfig} from '../../config';
import {component as Button} from 'focus-components/common/button/action';
const root = getConfig().API_ROOT;
import {navigate} from 'focus-core/history';
import InfosBadges from '../../views/user-info/infos-badges';

export default React.createClass({
    render() {
        var me = userHelper.getLogin();
        return <div data-focus='me-panel'>
            <label className='click-user-name' onClick={() => {navigate('u/'+me._id, true); this.props.closePopin();}}>{me.prenom + ' '+ me.nom + ' (' + me.email + ')'}</label>
            <InfosBadges id={me._id} togglePopinBadge={() => {navigate('u/'+userHelper.getLogin()._id, true);this.props.closePopin();}}/>
            {me.date_activation && <label>{i18n.t('person.adherentDepuis') + ' ' + moment(me.date_activation, moment.ISO_8601).format('DD/MM/YYYY')}</label>}
            {!me.date_activation && <label>{i18n.t('person.nonAdherent')}</label>}
            <Button type='button' label='person.modifierInformations' handleOnClick={() => {this.props.closePopin(); navigate('me', true)}}/>
        </div>
    }
});
