import React from 'react';
import FocusComponents from 'focus-components';
import {component as Select} from  'focus-components/common/select/radio';
export default React.createClass({
    componentWillReceiveProps(newProps) {
        if (newProps.value !== undefined) {
            this.setState({value: newProps.value});
        }
        if (newProps.label !== undefined) {
            this.setState({label: newProps.label});
        }
    },
    getInitialState() {
        return {label: this.props.label, value: this.props.value};
    },

    render() {
        return (
        <div data-focus="connection-check">
            <div data-focus="connection-label">{i18n.t(this.state.label)}</div>
            <div data-focus="connection-value">
                {this.state.value ?
                    <i className="material-icons green-icon">done</i> :
                    <i className="material-icons red-icon">clear</i>}
            </div>
        </div>);
    }
});

