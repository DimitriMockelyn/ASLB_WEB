import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import React from 'react';
import { navigate, views } from 'react-big-calendar/lib/utils/constants';
import fetch from '../../../utils/fetch';
import {mixin as formMixin} from 'focus-components/common/form';
import builder from 'focus-core/util/url/builder';
import {component as Popin} from 'focus-components/application/popin';
import evenementsServices from '../../../services/agenda';
import userHelper from 'focus-core/user';
import {component as Button} from 'focus-components/common/button/action';
import Toggle from 'focus-components/components/input/toggle';
import EventItem from './event-item';
import Panel from 'focus-components/components/panel';
export default React.createClass({
    displayName: 'NewsView',
    mixins: [formMixin],
    definitionPath: 'admin',
    getInitialState() {
        return {
            limit : 3
        }
    },
    componentWillMount() {
        this.loadAllNews();
    },
    loadAllNews() {
        evenementsServices.loadIncoming().then(res => {this.setState({events: res})});
    },
    renderActionsEdit() {
            return <div>
                <Button type='button' label='button.voirPlus' handleOnClick={() => {this.setState({limit: this.state.limit+3})}}/>
            </div>
        
    },
    /** @inheritDoc */
    renderContent() {
        return (
            <div data-focus='list-home'>
        <Panel  title='admin.incomingEvents' actions={this.renderActionsEdit}>
            <div data-focus='news-list'>
                {this.state.events && this.state.events.length > 0 && this.state.events.map((value, pos) => {
                    if (pos < this.state.limit) {
                        return <EventItem data={value}/>
                    }
                })}
                {this.state.events && this.state.events.length < this.state.limit && <div>
                    <label>{i18n.t('admin.noMoreEvents')}</label>
                    </div>}
            </div>
        </Panel>
        </div>
        );
    }
});
