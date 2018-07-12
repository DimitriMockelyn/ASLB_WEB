
import React from 'react';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Popin} from 'focus-components/application/popin';
import Info from './info';
import adminServices from '../../../services/admin';
import PresentationPanel from './panel';
import Panel from 'focus-components/components/panel';

import {component as Button} from 'focus-components/common/button/action';
export default React.createClass({
    displayName: 'NewsView',
    mixins: [formMixin],
    definitionPath: 'admin',
    getInitialState() {
        return {
            
        }
    },
    componentWillMount() {
        this.loadAllBadges();
    },
    loadAllBadges() {
        adminServices.allBadges().then(res => {this.setState({badge: res})});
    },
    openPopin(badge) {
        this.setState({selectedBadge : badge, openBadgePopin: true});
    },
    closePopin() {
        this.setState({selectedBadge : undefined, openBadgePopin: false});
        this.loadAllBadges();
    },
    renderActionsAdd() {
        return <div>
            <Button type='button' label='button.add' handleOnClick={() => { this.setState({openBadgePopin: true}); }} />
        </div>
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <Panel  title='Badges administrables' actions={this.renderActionsAdd}>
            <div data-focus='news-list'>
                {this.state.badge && this.state.badge.length > 0 && this.state.badge.map((value, pos) => {
                        return <PresentationPanel value={value} editAction={this.openPopin} />
                })}
            </div>
            {this.state.openBadgePopin && <Popin open={true} size='large' onPopinClose={this.closePopin}>
                <Info data={this.state.selectedBadge} onPopinClose={this.closePopin} isEdit={true} hasLoad={false} hasForm={false}/>
            </Popin>}
        </Panel>
        );
    }
});
