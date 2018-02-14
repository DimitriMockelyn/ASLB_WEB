import React from 'react';
import GeneralInfo from './general-info';
import InfoProfil from './info-profil';
export default React.createClass({
    displayName: 'PartenairesView',
    getInitialState() {
       return {id: this.props.id};
    },
    componentWillMount() {
    },
    /** @inheritDoc */
    render() {
        return (
            <div data-focus='user-profile-info'>
                <div data-focus='user-panel-left'>
                    <GeneralInfo id={this.props.id} />
                </div>
                <div data-focus='user-panel-right'>
                    <InfoProfil id={this.props.id} />
                </div>
            </div>
        );
    }
});
