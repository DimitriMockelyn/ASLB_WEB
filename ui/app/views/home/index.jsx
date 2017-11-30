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
        <div>
            <div data-focus='home-title'>
                    Bienvenue sur l'interface web de l'ASLB
            </div>
            <div data-focus='home-container'>
                <News hasLoad={false}/>
                <Evenements hasLoad={false} />
            </div>
        </div>
        );
    }
});
