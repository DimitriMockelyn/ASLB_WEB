import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import React from 'react';
import { navigate, views } from 'react-big-calendar/lib/utils/constants';
import fetch from '../../../utils/fetch';
import {mixin as formMixin} from 'focus-components/common/form';
import builder from 'focus-core/util/url/builder';
import {component as Popin} from 'focus-components/application/popin';
import adminServices from '../../../services/admin';
import userHelper from 'focus-core/user';
import {component as Button} from 'focus-components/common/button/action';
import Toggle from 'focus-components/components/input/toggle';
import NewsItem from './news-item';
import Panel from 'focus-components/components/panel';
export default React.createClass({
    displayName: 'NewsView',
    mixins: [formMixin],
    definitionPath: 'admin',
    getInitialState() {
        return {
            limitNews: 3
        }
    },
    componentWillMount() {
        this.loadAllNews();
    },
    loadAllNews() {
        adminServices.loadAllNews().then(res => {this.setState({news: res})});
    },
    renderActionsEdit() {
            return <div>
                <Button type='button' label='button.voirPlus' handleOnClick={() => {this.setState({limitNews: this.state.limitNews+3})}}/>
            </div>
        
    },
    /** @inheritDoc */
    renderContent() {
        return (
            <div data-focus='list-home'>
        <Panel  title='admin.derniereNews' actions={this.renderActionsEdit}>
            <div data-focus='news-list'>
                {this.state.news && this.state.news.length > 0 && this.state.news.map((value, pos) => {
                    if (pos < this.state.limitNews) {
                        return <NewsItem data={value}/>
                    }
                })}
                {this.state.news && this.state.news.length < this.state.limitNews && <div>
                    <label>{i18n.t('admin.noMoreNews')}</label>
                    </div>}
            </div>
        </Panel>
        </div>
        );
    }
});
