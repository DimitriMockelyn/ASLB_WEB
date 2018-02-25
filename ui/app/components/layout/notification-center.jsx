//libraries
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import userHelper from 'focus-core/user';
import moment from 'moment';
import FileUpload from '../file-upload';
import {getConfig} from '../../config';
import {component as Button} from 'focus-components/common/button/action';
const root = getConfig().API_ROOT;
import {navigate} from 'focus-core/history';
import profileServices from '../../services/profile';
export default React.createClass({
    timeouts: [],
    getInitialState() {
        return {opened : false,  notifications: []}
    },
    toggleOpen() {
        this.setState({opened : !this.state.opened});
    },
    componentWillMount() {
        let that = this;
        profileServices.loadNotifications().then(res => { that.setState({notifications: res.notifications})});
    },
    hasNews() {
        let count = 0;
        this.state.notifications.map(data => {
            if (!data.lu) {
                count++;
            }
        })
        return count;
    },
    onFocusNotif(id) {
        let that = this;
        return () => {
            console.log('SET TMEOUT');
            that.timeouts.push({id :id, func : setTimeout(() => { 
                    profileServices.readNotification(id).then(() => {that.componentWillMount()});
                }, 1000)
            });
        }
    },
    onBlurNotif(id) {
        let that = this;
        return () => {
            that.timeouts.map(tmt => {
                if (tmt.id.toString() === id.toString()) {
                    clearTimeout(tmt.func);
                }
            })
        }
    },
    render() {  
        let count = this.hasNews();
        return <div data-focus='notification-center'>
            <div onClick={this.toggleOpen}>
                <i className={count === 0 ? 'material-icons' : 'material-icons news'}>notifications</i>
                {count > 0 && <div className='notif-count'>{count}</div>}
            </div>
            {this.state.opened && this.state.notifications.length > 0 && <div className='notif-list'>
                {this.state.notifications.map(data => {
                    return <div className={data.lu ? 'read' : 'unread'} onMouseOver={!data.lu && this.onFocusNotif(data._id)} onMouseOut={!data.lu && this.onBlurNotif(data._id)}>
                        <div>
                            {data.message}
                        </div>
                    </div>
                })}
            </div>}
        </div>
    }
});
