import React from 'react';
import application from 'focus-core/application';
import history from 'focus-core/history';

// web components
import {cartridgeBehaviour} from 'focus-components/page/mixin';
import Panel from 'focus-components/components/panel';
import {component as Popin} from 'focus-components/application/popin';
import userHelper from 'focus-core/user';
import homeServices from '../../../services/home';
import ScrollspyContainer from 'focus-components/components/scrollspy-container';
import Users from '../users';
import Mails from '../mails';
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
    /** @inheritDoc */
    render() {
        return (
        <div>
            <div>
                <ScrollspyContainer>
                    <Users hasLoad={false} actif={false} />
                    <Mails hasLoad={false} />
                </ScrollspyContainer>
            </div>
        </div>
        );
    }
});
