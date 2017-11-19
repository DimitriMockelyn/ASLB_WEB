import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import React from 'react';
import { navigate, views } from 'react-big-calendar/lib/utils/constants';
import fetch from '../../../utils/fetch';
import {mixin as formMixin} from 'focus-components/common/form';
import builder from 'focus-core/util/url/builder';
import {component as Popin} from 'focus-components/application/popin';
import adminServices from '../../../services/admin';
import userHelper from 'focus-core/user';
import {component as Button} from 'focus-components/common/button/action';
import Toggle from 'focus-components/components/input/toggle';
import Panel from 'focus-components/components/panel';
import Input from 'focus-components/components/input/text';
export default React.createClass({
    displayName: 'MailView',
    mixins: [formMixin],
    definitionPath: 'admin',
    getInitialState() {
        return {}
    },
    componentWillMount() {
        adminServices.loadUsersForMail().then(res => {this.setState({mail: res})});
    },
    loadAllUsers() {
        adminServices.loadAllUsers({filter: this.state.filter}).then(res => {this.setState({users: res})});
    },
    sendMail(field) {
        let users = this.state.mail[field];
        window.location.href = 'mailto:'+userHelper.getLogin().email+'?cc='+users.join(",");
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <Panel  title='Mails' >
            <Button type='button' label='admin.mailAll' handleOnClick={() => {this.sendMail('tous')}}/>
            <Button type='button' label='admin.mailCreateurs' handleOnClick={() => {this.sendMail('createurCours')}}/>
            <Button type='button' label='admin.mailAdmins' handleOnClick={() => {this.sendMail('admins')}}/>
        </Panel>
        );
    }
});
