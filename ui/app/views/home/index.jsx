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
        <div style={{'margin-left': '200px', 'margin-top':'200px'}}>
            <div>
                Bonjour, ceci est la page d'accueil
            </div>
            <div>
                Cette page n'est pas encore construite car le site est en cours de création depuis dimanche :)
            </div>
            <div>
                Vous pouvez néanmoins soumettre vos remarques <a href="mailto:dimitri.mockelyn@gmail.com?subject=Il marche pô ton site lol"> ici </a>
            </div>
            <div>
                En phase de test, les compte crées sont automatiquement considérés comme des membres actifs à date du jour.
            </div>
        </div>
        );
    }
});
