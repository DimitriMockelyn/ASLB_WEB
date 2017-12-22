import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import moment from 'moment';
import userHelper from 'focus-core/user';
import userServices from '../../services/user';
import {component as Popin} from 'focus-components/application/popin';
import ConnectOrCreate from './connect-or-create';
import MyInfo from './my-info';
import Bienvenue from './bienvenue';
export default React.createClass({
    displayName: 'HomeView',
    mixins: [formMixin],
    definitionPath: 'person',
    componentWillMount() {
        userServices.loadMe().then( res => {
            this.setState(res);
        })
        this.action = {
            save: this.saveEmpty,
            loadReference: this.saveEmpty
        }
    },
    saveEmpty() {
        return;
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
    componentDidMount() {
        if (userHelper.getLogin().premiereConnexion) {
            //Toggle de la popin de bienvenue
            this.setState({openPopinBienvenue: true});
        }
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div data-scope='profile-top' >
            <div data-scope='user-info' onClick={this.togglePopin}>
            {userHelper.getLogin() && 
                <label>{userHelper.getLogin().prenom + ' ' + userHelper.getLogin().nom}</label>}
            {!userHelper.getLogin() && 
                <label>{i18n.t('user.connect')}</label> }
                {(!userHelper.getLogin() || !userHelper.getLogin().avatar) &&<i className='material-icons'>person</i>}
                {(userHelper.getLogin() && userHelper.getLogin().avatar) && <img  src={'data:image/png;base64,'+userHelper.getLogin().avatar} />}
            </div>
            {this.state.openPopin && <Popin type='from-right' open={true} onPopinClose={this.closePopin}>
                {!userHelper.getLogin() && 
                    <div>
                        <ConnectOrCreate hasLoad={false} hasForm={false}/>
                        
                    </div>
                }
                {userHelper.getLogin() && <div>
                            <MyInfo closePopin={this.closePopin} />
                            <Button label='user.disconnect' type='button' handleOnClick={this.disconnect}/>
                        </div>
                }
            </Popin>}
            {this.state.openPopinBienvenue && <Bienvenue onClose={() => {this.setState({openPopinBienvenue: false});}} />}
        </div>
        );
    }
});
