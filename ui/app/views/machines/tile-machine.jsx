import React from 'react';
import moment from 'moment';
import userHelper from 'focus-core/user';
import homeServices from '../../services/home';
export default React.createClass({
    displayName: 'TileView',
    getInitialState() {
        return {data : this.props.data, metadata: this.checkClickable(this.props.data)}
    },
    componentWillReceiveProps(newProps) {
        this.setState({data : newProps.data, metadata: this.checkClickable(newProps.data)})
    },
    checkClickable(data) {
        
        let res = {
            canClick: false,
            isMine: false,
            isOther: false,
            isOld: false
        }
        let dateFin = moment(data.dateDebut).clone().add(30, 'minutes');

        let idMe = undefined;
        if (userHelper.getLogin()) {
            idMe = userHelper.getLogin()._id;
        }
        if (idMe && data.membre && data.membre._id.toString() === idMe.toString()) {
            res.isMine = true;
            res.canClick = true;
        } else if (idMe && !data.membre) {
            res.canClick = true;
        } else if (data.membre) {
            res.isOther = true;
        }

        if (moment().isAfter(dateFin)) {
            res.isOld = true;
            res.canClick = false;
        }
        return res;
    },
    click() {
        homeServices.toggleSelfForMachine(this.state.data._id).then(res => {this.setState({data: res, metadata: this.checkClickable(res)})});
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
        res['color']='white';
        res['textAlign'] =  'center';
        return res;
    },
    /** @inheritDoc */
    render() {
        
        return (
            <div data-focus='tile-machine' className={this.state.metadata.canClick? 'canClick' : ''} onClick={this.state.metadata.canClick && this.click} style={this.computeStyle()} title={this.state.data && this.state.data.membre && this.state.data.membre.prenom + ' ' + this.state.data.membre.nom}>
                {this.state.data && this.state.data.membre && this.state.data.membre.prenom}
            </div>
        );
    }
});
