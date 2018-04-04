import React from 'react';
import profileServices from '../../services/profile';
import userHelper from 'focus-core/user';
import {component as Popin} from 'focus-components/application/popin';

export default React.createClass({
    displayName: 'BadgesView',
    getInitialState() {
        return {};
    },
    componentWillMount() {
        profileServices.getInfoBadges(this.props.id).then((res) => {
            this.computeBadgesTypes(res);
        })
    },
    computeBadgesTypes(res) {
        let allBadges = res.allBadges;
        let badgesRecus = res.badgesRecus;
        let bronze = [];
        let argent = [];
        let or = [];
        let platine = [];
        let allAquired = [];
        let mapCount = {};
        allBadges.map(item => {
            mapCount[item._id] = 0;
        })
        if (badgesRecus && badgesRecus.length > 0) {
            badgesRecus.map(badgeRecu => {
                var badgeDef = allBadges.find(elt => {return elt._id === badgeRecu.badge});
                allAquired.push(badgeDef);
                mapCount[badgeDef._id] = mapCount[badgeDef._id]+1;
                if (badgeDef.code === 'Platinium') {
                    platine.push(badgeRecu);                    
                } else if (badgeDef.code === 'Or') {
                    or.push(badgeRecu);
                } else if(badgeDef.code === 'Argent') {
                    argent.push(badgeRecu);
                } else {
                    bronze.push(badgeRecu);
                } 
            })
        }
        this.setState({allBadges, badgesRecus,bronze, argent, or, platine, allAquired, mapCount});
    },
    computeBadgeFor(data, className) {
        if (data && data.length > 0) {
            return <div >
                    <div className={className} />
                    <label>{' '+data.length}</label>
                </div>
        }
    },
    togglePopin() {
        this.setState({showPopin: true});
    },
    closePopin() {
        this.setState({showPopin: false});
    },
    /** @inheritDoc */
    render() {
        return (
            <div data-focus='badges-line'>
                <div data-focus='round-line' onClick={this.togglePopin}>
                    {this.computeBadgeFor(this.state.bronze, 'Bronze')}
                    {this.computeBadgeFor(this.state.argent, 'Argent')}
                    {this.computeBadgeFor(this.state.or, 'Or')}
                    {this.computeBadgeFor(this.state.platinium, 'Platinium')}
                </div>
                {this.state.showPopin && <Popin open={true} onPopinClose={this.closePopin}>
                        {this.state.allBadges.map(bd => {
                            return <div>
                                    <div className={bd.code} />
                                    <div>
                                        <div>
                                            {bd.titre}
                                        </div>
                                        <div>
                                            {bd.description} 
                                        </div>
                                        <div>
                                            {' x'+this.state.mapCount[bd._id]}
                                        </div>
                                    </div>
                                </div>
                        })}
                    </Popin>}
            </div>
        );
    }
});
