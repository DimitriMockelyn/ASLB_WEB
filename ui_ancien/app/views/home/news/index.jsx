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
            limitNews: 3,
            showPopupNews : false
        }
    },
    componentWillMount() {
        this.loadAllNews().then ( res => {
            if (userHelper.getLogin() && res && res.length > 0) {
                const id = userHelper.getLogin()._id;
                if (res[0].important) {
                    if (res[0].luPar.indexOf(id) === -1) {
                        this.setState({openPopinImportant: res[0]});
                        adminServices.markNewsAsRead(res[0]._id);
                    }
                    return;
                }
            }
        })
    },
    loadAllNews() {
        return adminServices.loadAllNews().then(res => {
            this.setState({news: res}); 
            return res;
        });
    },
    renderActionsEdit() {
            return <div data-focus='display-row'>
                <div style={{'margin-right': 'auto'}}>
                    <Toggle ref='toggle' value={this.state.showPopupNews} label={i18n.t('home.newsFilterPopup')} onChange={this.toggleNewsPopup} />
                </div>
                <Button type='button' label='button.voirPlus' handleOnClick={() => {this.setState({limitNews: this.state.limitNews+3})}}/>
                
            </div>
        
    },
    closePopinImportant() {
        this.setState({openPopinImportant: undefined});
    },
    toggleNewsPopup() {
        this.setState({showPopupNews : !this.state.showPopupNews});
    },
    /** @inheritDoc */
    renderContent() {
        return (
            <div data-focus='list-home' className='expanded-actions'>
        <Panel  title='admin.derniereNews' actions={this.renderActionsEdit}>
        
            <div data-focus='news-list'>
                {this.state.news && this.state.news.length > 0 && this.state.news.filter(news => this.state.showPopupNews || !news.important).map((value, pos) => {
                    if (pos < this.state.limitNews) {
                        return <NewsItem data={value}/>
                    }
                })}
                {this.state.news && this.state.news.length < this.state.limitNews && <div>
                    <label>{i18n.t('admin.noMoreNews')}</label>
                    </div>}
            </div>
        </Panel>
        {this.state.openPopinImportant && <Popin open={true} onPopinClose={this.closePopinImportant}>
            <NewsItem data={this.state.openPopinImportant}/>
        </Popin>}
        </div>
        
        );
    }
});