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
import {translate} from 'focus-core/translation';
import Carousel from 'nuka-carousel';
export default React.createClass({
    displayName: 'NewsView',
    mixins: [formMixin],
    definitionPath: 'admin',
    getInitialState() {
        return {
            limit : 100
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
        var Decorators = [{
            component:  React.createClass({
              render() {
                return (
                  <i className='material-icons'
                    onClick={this.props.previousSlide}>
                    keyboard_arrow_left
                  </i>
                )
              }
            }),
            position: 'CenterLeft',
            style: {
              padding: 20
            }
          },{
            component:  React.createClass({
              render() {
                return (
                  <i className='material-icons'
                    onClick={this.props.nextSlide}>
                    keyboard_arrow_right
                  </i>
                )
              }
            }),
            position: 'CenterRight',
            style: {
              padding: 20
            }
          }];
        return (
            <div data-focus='list-home'>
            <div className='center-text'>{translate('admin.incomingEvents')}</div>
            <div data-focus='event-list'>
            <Carousel decorators={Decorators} slidesToShow={4} >
                {this.state.events && this.state.events.length > 0 && this.state.events.map((value, pos) => {
                    if (pos < this.state.limit) {
                        return <EventItem data={value}/>
                    }
                })}
                </Carousel>
            </div>
        </div>
        );
    }
});
