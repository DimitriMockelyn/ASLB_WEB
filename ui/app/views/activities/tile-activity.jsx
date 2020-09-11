import React from 'react';
import moment from 'moment';
import userHelper from 'focus-core/user';
import homeServices from '../../services/home';
import {component as Popin} from 'focus-components/application/popin';
import EventInfos from './event-infos';
import CreateEvent from './create-event';
import adminServices from '../../services/admin';
export default React.createClass({
    displayName: 'TileView',
    getInitialState() {
        return {data : this.props.data, metadata: this.checkClickable(this.props.data)}
    },
    componentWillReceiveProps(newProps) {
        this.setState({data : newProps.data, metadata: this.checkClickable(newProps.data)})
    },
    createEvent(data) {
        let entity = {...data, ...this.state.data};
        return homeServices.createActivityInCreneau(entity).then(res => {
            this.setState({data: res, metadata: this.checkClickable(res)})
        })
    },
    toggleLock( locked) {
        adminServices.lockActivity(this.props.data._id, locked).then(() => {
            let state = this.state.data;
            state.locked = !state.locked;
            this.setState({data: state},this.closeCreerEvent);
        });
    },
    checkClickable(data) {
        
        let res = {
            canClick: userHelper.getLogin() ? true : false,
            isMine: false,
            isOther: false,
            isOld: false
        }
        let dateFin = moment(data.dateDebut).clone().add(30, 'minutes');

        let idMe = undefined;
        if (    userHelper.getLogin()) {
            idMe = userHelper.getLogin()._id;
        }
        if (idMe && data.membre && data.membre._id.toString() === idMe.toString()) {
            res.isMine = true;
        }
        if (data.locked && userHelper.getLogin() && !userHelper.getLogin().isAdmin) {
            res.canClick = false;
        }

        if (moment().isAfter(dateFin)) {
            res.isOld = true;
            res.canClick = false;
        }
        return res;
    },
    click() {
        //homeServices.toggleSelfForMachine(this.state.data._id).then(res => {this.setState({data: res, metadata: this.checkClickable(res)})});
        if (!this.state.data.createur) {
            this.setState({creerEvent: true});
        } else {
            this.setState({selectedEvent: true});
        }
    },
    computeStyle() {
        let res = {};
        const state = this.state.metadata;
        if (state.canClick) {
            res['cursor'] = 'pointer';
        }
        res['backgroundColor'] = '#EEEEEE';
        if (state.isMine) {
            res['backgroundColor'] = 'hsla(148, 56%, 31%, 1)';
        }
        if (state.isOther) {
            res['backgroundColor'] = '#ab1111';
        }
        if (state.isOld) {
            res['opacity'] = '0.5';
        }
        res['color']='black';
        res['textAlign'] =  'center';
        res['justifyContent'] = 'center';
        return res;
    },
    closePopin() {
        this.setState({selectedEvent: false}, this.props.onRefresh);
    },
    closeCreerEvent() {
        this.setState({creerEvent: false}, this.props.onRefresh);
    },
    /** @inheritDoc */
    render() {
        
        return (
            <div style={{'width': '100%'}} >            
                <div  data-focus='tile-machine' className={this.state.metadata.canClick? 'canClick' : ''}  style={this.computeStyle()} onClick={this.state.metadata.canClick && this.click} >
                    {this.state.data && !this.state.data.locked && this.state.data.title}
                    {this.state.data && this.state.data.locked && <i className="material-icons">lock</i> }
                </div>
                {this.state.selectedEvent && <Popin open={true}  onPopinClose={this.closePopin}>
                    <EventInfos event={this.state.data} onPopinClose={this.closePopin} isEdit={false} hasLoad={false} hasForm={false} 
                    />
                </Popin>}
            {this.state.creerEvent && <Popin open={true}  onPopinClose={this.closeCreerEvent}>
                <CreateEvent toggleLock={this.toggleLock} data={this.state.data} id={this.state.data._id} onPopinClose={this.closeCreerEvent} hasLoad={false} hasForm={false} createEvent={this.createEvent}/>
            </Popin>}
            </div>

        );
    }
});
