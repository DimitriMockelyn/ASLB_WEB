import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import React from 'react';
import { navigate, views } from 'react-big-calendar/lib/utils/constants';
import {mixin as formMixin} from 'focus-components/common/form';
import builder from 'focus-core/util/url/builder';
import {component as Popin} from 'focus-components/application/popin';
import userHelper from 'focus-core/user';
import {component as Button} from 'focus-components/common/button/action';
import Toggle from 'focus-components/components/input/toggle';
import Panel from 'focus-components/components/panel';
import Carousel from 'nuka-carousel';
import {translate} from 'focus-core/translation';

export default React.createClass({
    displayName: 'HeaderView',
    mixins: [formMixin],
    definitionPath: 'home',
    referenceNames: ['typeEvenements'],
    /** @inheritDoc */
    togglePopinLegende(code) {
        return () => {
            this.setState({legendePopin: code});
        }
    },
    closePopinLegende() {
        this.setState({legendePopin: undefined});
    },
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
          let eventsDesc = [];
          if (this.state && this.state.reference && this.state.reference.typeEvenements) {
            this.state.reference.typeEvenements.map(data => {
              if (data.image) {
                eventsDesc.push(data);
              }
            });
          }
        return (
            <div>
              <div className='center-text top-header-act'>{translate('admin.detailActivites')}</div>
            <div data-focus='header-activites'>           
                <Carousel wrapAround={true} slidesToShow={7} decorators={Decorators}>
                {eventsDesc.map(data => {
                    if (data.image) {
                    return (<div onClick={this.togglePopinLegende(data.code)}>
                            <img src={data.image} />
                            <div className={'header-name ' + data.code}>{data.name}</div>
                        </div>);
                    }
                })}
                </Carousel>
            </div>
            {this.state.legendePopin && <Popin open={true} size='small' onPopinClose={this.closePopinLegende}>
                <div data-focus='legende-description'>
                    <label>{this.state.reference.typeEvenements.find(data => {return data.code === this.state.legendePopin}).name}</label>
                    <div dangerouslySetInnerHTML={{ __html: this.state.reference.typeEvenements.find(data => { return data.code === this.state.legendePopin}).description}}/>
                </div>
            </Popin>}
            </div>
        );
    }
});
