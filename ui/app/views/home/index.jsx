import React from 'react';
import application from 'focus-core/application';
import history from 'focus-core/history';

// web components
import {cartridgeBehaviour} from 'focus-components/page/mixin';
import Panel from 'focus-components/components/panel';
import {component as Popin} from 'focus-components/application/popin';
import userHelper from 'focus-core/user';
import homeServices from '../../services/home';
import News from './news';
import Evenements from './evenements';
import Cartridge from './cartridge';
import Summary from './summary';
import DisplayCarrousel from './display-caroussel';
import HeaderActivities from './header-activites';
import Chat from './chat';

export default React.createClass({
    displayName: 'HomeView',
    mixins: [cartridgeBehaviour],
    /**
     * Related to the CartridgeBehaviour.
     * Define the cartridge configuration.
     * @return {[type]} [description]
     */
    cartridgeConfiguration() {
        return {
            cartridge: {component: Cartridge},
            summary: {component: Summary},
            actions: {
                primary: [],
                secondary: []
            }
        };
    },
    componentWillMount() {
        this._registerCartridge();
        this.setState({});
    },
    alertHome() {
        homeServices.loadTest().then(res => {
            alert(res);
        });
    },
    /** @inheritDoc */
    render() {
        return (
        <div data-focus='home-chat-display'>
            <div>
            <HeaderActivities hasLoad={false} />
            <div data-focus='home-title'>
            Bienvenue sur le site de l’aslb !
            </div>
            <Evenements hasLoad={false} />
            <News hasLoad={false}/>                
            </div>
            <Chat hasLoad={false} />
        </div>
        );
    }
});
