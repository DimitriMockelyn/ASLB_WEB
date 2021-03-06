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
import ScrollspyContainer from 'focus-components/components/scrollspy-container';
import Users from './users';
import Partenaires from './partenaire';
import Mails from './mails';
import Presentations from './presentations';
import TypeActivites from './typeActivites';
import Entreprises from './entreprise';
import Ribbons from './ribbons';
import {navigate} from 'focus-core/history';
import {component as Button} from 'focus-components/common/button/action';
import Blocs from './blocs';
import Medias from './medias';
import Machines from './machines';
import Activites from './activites';
import DayOffs from './dayOffs';
import ActivityTimes from './activityTimes';
import Files from './files';
import {downloadCSV} from '../../utils/download';
import adminServices from '../../services/admin';

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
    exportEvents() {
        adminServices.exportAllEvents().then(res => {downloadCSV(res, 'evenements.csv')});;
    },
    /** @inheritDoc */
    render() {
        return (
        <div>
            <div>
                <ScrollspyContainer>
                    <Button icon='person' type='button' shape='' label='admin.adminUsers' handleOnClick={() => {navigate('adminUsers', true)}} />
                    <Button icon='data_usage' type='button' shape='' label='admin.adminBlocs' handleOnClick={() => {navigate('adminBlocs', true)}} />
                    <Button icon='bar_chart' type='button' shape='' label='admin.exportEvents' handleOnClick={this.exportEvents} />
                    <Button icon='stars' type='button' shape='' label='admin.adminBadges' handleOnClick={() => {navigate('adminBadges', true)}} />
                    <News hasLoad={false} />
                    <Partenaires hasLoad={false} />
                    <Entreprises hasLoad={false} />
                    <Medias hasLoad={false} />
                    <Presentations hasLoad={false} />
                    <TypeActivites hasLoad={false} />
                    <Machines hasLoad={false} />
                    <Activites hasLoad={false} />
                    <Ribbons hasLoad={false} />
                    <DayOffs hasLoad={false} />
                    <ActivityTimes hasLoad={false} />
                    <Files hasLoad={false} />
                    
                </ScrollspyContainer>
            </div>
        </div>
        );
    }
});
