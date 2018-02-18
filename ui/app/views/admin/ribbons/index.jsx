import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import React from 'react';
import { navigate, views } from 'react-big-calendar/lib/utils/constants';
import fetch from '../../../utils/fetch';
import {mixin as formMixin} from 'focus-components/common/form';
import builder from 'focus-core/util/url/builder';
import {component as Popin} from 'focus-components/application/popin';
import Info from './info';
import adminServices from '../../../services/admin';
import homeServices from '../../../services/home';
import userHelper from 'focus-core/user';
import {component as Button} from 'focus-components/common/button/action';
import Toggle from 'focus-components/components/input/toggle';
import PresentationPanel from './panel';
import Panel from 'focus-components/components/panel';
export default React.createClass({
    displayName: 'NewsView',
    mixins: [formMixin],
    definitionPath: 'admin',
    getInitialState() {
        return {
            limit: 3
        }
    },
    componentWillMount() {
        this.loadAllPresentations();
    },
    loadAllPresentations() {
        adminServices.loadAllRibbons().then(res => {this.setState({ptn: res})});
    },
    openPopin(ptn) {
        this.setState({selectedPtn : ptn, openNewsPopin: true});
    },
    closePopin() {
        this.setState({selectedPtn : undefined, openNewsPopin: false});
        this.loadAllPresentations();
    },
    renderActionsEdit() {
        if (!this.props.hideButtons) {
            return <div>
                <Button type='button' label='admin.addRibbon' handleOnClick={() => {this.openPopin()}}/>
            </div>
        }
    },
    delete(data) {
        adminServices.deleteRibbon({id: data._id}).then(this.loadAllPresentations);
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <Panel  title='Rubans' actions={this.renderActionsEdit}>
            <div data-focus='news-list'>
                {this.state.ptn && this.state.ptn.length > 0 && this.state.ptn.map((value, pos) => {
                        return <PresentationPanel value={value} editAction={this.openPopin} deleteAction={this.delete}/>
                })}
            </div>
            {this.state.openNewsPopin && <div className='mega-large'><Popin open={true} size='large' onPopinClose={this.closePopin}>
                <Info data={this.state.selectedPtn} onPopinClose={this.closePopin} isEdit={true} hasLoad={false} hasForm={false}/>
            </Popin>
            </div>}
        </Panel>
        );
    }
});
