import React from 'react';
import GeneralInfo from './general-info';
import InfoProfil from './info-profil';
import {component as Popin} from 'focus-components/application/popin';
import UserRibbonSelect from './user-ribbon-select';
import userHelper from 'focus-core/user';

export default React.createClass({
    displayName: 'PartenairesView',
    getInitialState() {
       return {id: this.props.id};
    },
    componentWillMount() {
    },
    togglePopinRibbon() {
        this.setState({togglePopinRibbon: true});
    },
    closePopinRibbon() {
        this.setState({togglePopinRibbon: false});
        this.refs.general.reloadRibbon();
    },
    /** @inheritDoc */
    render() {
        return (
            <div data-focus='user-profile-info'>
                <div data-focus='user-panel-left'>
                    <GeneralInfo ref='general' id={this.props.id} togglePopinRibbon={this.togglePopinRibbon} />
                </div>
                <div data-focus='user-panel-right'>
                    <InfoProfil id={this.props.id} />
                </div>
                {this.state.togglePopinRibbon && <Popin open onPopinClose={this.closePopinRibbon}>
                    <UserRibbonSelect hasLoad={false} data={userHelper.getLogin()} onPopinClose={this.closePopinRibbon}/>
                </Popin>}
            </div>
        );
    }
});
