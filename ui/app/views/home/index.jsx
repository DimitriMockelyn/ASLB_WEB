import React from 'react';
import application from 'focus-core/application';
import history from 'focus-core/history';

// web components
import {cartridgeBehaviour} from 'focus-components/page/mixin';
import Panel from 'focus-components/components/panel';
import {component as Popin} from 'focus-components/application/popin';
import userHelper from 'focus-core/user';
import homeServices from '../../services/home';
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
            <div>
                <label>
                    Bienvenue sur l'interface web de l'ASLB
                </label>
            </div>
            <div>
                <label>
                    Ce site est en cours de construction. Les prochaines améliorations intégreront une interface d'administration et des news
                </label>
            </div>
            <div>
                <label>
                    Vous pouvez néanmoins vous balader sur le site et commencer a vous inscrire a des activités :)
                </label>
            </div>
        </div>
        );
    }
});
