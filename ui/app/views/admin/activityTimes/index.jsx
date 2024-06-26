import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import React from 'react';
import { navigate, views } from 'react-big-calendar/lib/utils/constants';
import fetch from '../../../utils/fetch';
import {mixin as formMixin} from 'focus-components/common/form';
import builder from 'focus-core/util/url/builder';
import {component as Popin} from 'focus-components/application/popin';
import PartenaireInfo from './partenaire-info';
import adminServices from '../../../services/admin';
import homeServices from '../../../services/home';
import userHelper from 'focus-core/user';
import {component as Button} from 'focus-components/common/button/action';
import Toggle from 'focus-components/components/input/toggle';
import PartenairePanel from './partenaire-panel';
import Panel from 'focus-components/components/panel';
export default React.createClass({
    displayName: 'NewsView',
    mixins: [formMixin],
    definitionPath: 'admin',
    getInitialState() {
        return {
            limit: 7
        }
    },
    componentWillMount() {
        this.loadAllActivityTimes();
    },
    loadAllActivityTimes() {
        homeServices.loadActivites().then(acts => {
            acts.forEach(function(act) {
                act.name = act.nom;
            })
            this.setState({acts: acts}, () => {
            homeServices.loadActivityTimes().then(res => {this.setState({ptn: res})});
        })});
    },
    openPopin(ptn) {
        this.setState({selectedPtn : ptn, openNewsPopin: true});
    },
    closePopin() {
        this.setState({selectedPtn : undefined, openNewsPopin: false});
        this.loadAllActivityTimes();
    },
    renderActionsEdit() {
        if (!this.props.hideButtons) {
            return <div>
                <Button type='button' label='admin.addActivityTime' handleOnClick={() => {this.openPopin()}}/>
                <Button type='button' label='button.voirPlus' handleOnClick={() => {this.setState({limit: this.state.limit+3})}}/>
            </div>
        }
    },
    delete(data) {
        adminServices.deleteActivityTimes({id: data._id}).then(this.loadAllActivityTimes);
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <Panel  title='activityTimes.panelTitle' actions={this.renderActionsEdit}>
            <div data-focus='news-list'>
                {this.state.ptn && this.state.ptn.length > 0 && this.state.ptn.map((value, pos) => {
                    if (pos < this.state.limit) {
                        return <PartenairePanel value={value} editAction={this.openPopin} deleteAction={this.delete} acts={this.state.acts}/>
                    }
                })}
            </div>
            {this.state.openNewsPopin && <Popin open={true} size='large' onPopinClose={this.closePopin}>
                <PartenaireInfo data={this.state.selectedPtn} onPopinClose={this.closePopin} isEdit={true} hasLoad={false} hasForm={false} acts={this.state.acts}/>
            </Popin>}
        </Panel>
        );
    }
});
