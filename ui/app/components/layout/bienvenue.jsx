//libraries
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import userHelper from 'focus-core/user';
import moment from 'moment';
import FileUpload from '../file-upload';
import {getConfig} from '../../config';
import {component as Button} from 'focus-components/common/button/action';
const root = getConfig().API_ROOT;
import {component as Popin} from 'focus-components/application/popin';
import {navigate} from 'focus-core/history';
import {component as Label} from 'focus-components/common/label';

export default React.createClass({
    getInitialState() {
        return {step: 0, message: 'home.message.0'}
    },
    upgradeStep() {
        var value = this.state.step+1;
        if (value > 5) {
            return this.props.onClose();
        }
        this.setState({step: (this.state.step+1)})
        setTimeout(() => {this.setState({message: 'home.message.'+value.toString()})}, 1000);
    },
    downgradeStep() {
        this.setState({step: (this.state.step-1)%2})
    },
    render() {
        var me = userHelper.getLogin();
        return <div data-focus='welcome' className={'step'+this.state.step}>
                <div onClick={this.upgradeStep}>
                    {(this.state.step === 0 || this.state.step === 5) && <div data-focus="menu-brand" />}
                    {i18n.t(this.state.message).split('\n').map(text => {
                        return <Label name={text} />
                    })}
                    
                </div>
        </div>
    }
});
