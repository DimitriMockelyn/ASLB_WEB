import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import moment from 'moment';
import userHelper from 'focus-core/user';
import userServices from '../../services/user';
import {component as Popin} from 'focus-components/application/popin';
import ConnectOrCreate from './connect-or-create';
export default React.createClass({
    displayName: 'HomeView',
    mixins: [formMixin],
    definitionPath: 'person',
    componentWillMount() {
        userServices.loadMe().then( res => {
            userHelper.setLogin(res);
            this.setState(res);
        })
    },
    togglePopin() {
        this.setState({openPopin: true});
    },
    closePopin() {
        this.setState({openPopin: false});
    },
    getInitialState() {
        return {};
    },
    disconnect() {
        userServices.disconnect();
        window.location.reload();
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div data-scope='profile-top' onClick={this.togglePopin}>
            <div data-scope='user-info' >
            {userHelper.getLogin() && 
                <label>{userHelper.getLogin().prenom + ' ' + userHelper.getLogin().nom}</label>}
            {!userHelper.getLogin() && 
                <label>{i18n.t('user.connect')}</label>}
            </div>
            {this.state.openPopin && <Popin type='from-right' ref='popin-user' open='true' onPopinClose={this.closePopin}>
            {!userHelper.getLogin() && 
                <div>
                    <ConnectOrCreate hasLoad={false}/>
                    
                </div>
            }
            {userHelper.getLogin() && 
                <div onClick={this.disconnect}>
                    <label>{i18n.t('user.disconnect')}</label>
                    
                </div>
            }
            </Popin>}
        </div>
        );
    }
});
