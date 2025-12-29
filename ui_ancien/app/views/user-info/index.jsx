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
    togglePopinBadge(data) {
        this.setState({popinBadge: data});
    },
    closePopinBadge() {
        this.setState({popinBadge: undefined});
    },
    /** @inheritDoc */
    render() {
        return (
            <div data-focus='user-profile-info'>
                <div data-focus='user-panel-left'>
                    <GeneralInfo ref='general' id={this.props.id} togglePopinRibbon={this.togglePopinRibbon} togglePopinBadge={this.togglePopinBadge}/>
                </div>
                <div data-focus='user-panel-right'>
                    <InfoProfil id={this.props.id} />
                </div>
                {this.state.togglePopinRibbon && <Popin open onPopinClose={this.closePopinRibbon}>
                    <UserRibbonSelect hasLoad={false} data={userHelper.getLogin()} onPopinClose={this.closePopinRibbon}/>
                </Popin>}
                {this.state.popinBadge && <Popin open={true} onPopinClose={this.closePopinBadge}>
                        {this.state.popinBadge.badgesWithDate.map(bd => {
                            return <div data-focus='badges-line'><div className={this.state.popinBadge.mapCount[bd._id] !== 0 ? 'badge-info-line '+bd.code : 'badge-info-line'}>
                                        <div data-focus='round-line'>
                                            <div>
                                                <div className={bd.code} />
                                            </div>
                                        </div>
                                        <div className='desc-line'>
                                            <div className='title'>
                                                {bd.titre}
                                            </div>
                                            {this.state.popinBadge.mapCount[bd._id] !== 0 && <div className='count'>
                                                {' x'+this.state.popinBadge.mapCount[bd._id]}
                                            </div>}
                                            <div className='description'>
                                                {bd.description} 
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                        })}
                    </Popin>}
            </div>
        );
    }
});
