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
import UserInfo from './user-info';
import {downloadCSV} from '../../../utils/download';
export default React.createClass({
    displayName: 'UsersView',
    mixins: [formMixin],
    definitionPath: 'admin',
    getInitialState() {
        return {
            limit: 3,
            filter: ''
        }
    },
    componentWillMount() {
        this.loadAllUsers();
    },
    loadAllUsers() {
        adminServices.loadAllUsers({filter: this.state.filter}).then(res => {this.setState({users: res})});
    },
    export() {
        adminServices.exportAllUsers({filter: this.state.filter}).then(res => {downloadCSV(res, 'users.csv')});;
    },
    openPopin(user) {
        this.setState({selectedUser : user});
    },
    closePopin() {
        this.setState({selectedUser : undefined});
        this.loadAllUsers();
    },
    renderActionsEdit() {
        if (!this.props.hideButtons) {
            return <div>
                <Button type='button' label='button.exporter' handleOnClick={this.export} />
                <Button type='button' label='button.voirPlus' handleOnClick={() => {this.setState({limit: this.state.limit+3})}}/>
            </div>
        }
    },
    onChangeInput(value) {
        this.setState({filter: value}, this.loadAllUsers);
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <Panel  title='Utilisateurs' actions={this.renderActionsEdit}>
            <Input placeholder='Tapez votre recherche' value={this.state.filter} onChange={this.onChangeInput} />
            <div data-focus='user-list'>
                {this.state.users && this.state.users.length > 0 && this.state.users.map((value, pos) => {
                    if (pos < this.state.limit) {
                        return <div data-focus='user-line'>
                            <div>
                                <div>{value.nom + ' ' + value.prenom}</div>
                                {value.canCreate && <i className='material-icons' >border_color</i>}
                                {value.isAdmin && <i className='material-icons' >build</i>}
                            </div>
                            <div>{value.email}</div>
                            <div><Button type='button' icon='edit' shape='fav' handleOnClick={() => {this.openPopin(value)}}/></div>
                        </div>
                    }
                })}
            </div>
            {this.state.selectedUser && <Popin open={true} size='medium' onPopinClose={this.closePopin}>
                <UserInfo hasLoad={false} data={this.state.selectedUser} onPopinClose={this.closePopin}/>
            </Popin>}
        </Panel>
        );
    }
});
