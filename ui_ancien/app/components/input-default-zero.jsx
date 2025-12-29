//libraries
import React, {Component, PropTypes} from 'react';
import userHelper from 'focus-core/user';
import Input from 'focus-components/components/input/text';
export default React.createClass({
    getValue(){
        if (this.refs.field.getValue()) {
            return this.refs.field.getValue();
        }
        return userHelper.hasRole(['OF']) ? this.refs.field.getValue() : 0;
    },
    render() {
        return (
            <Input
                value={this.props.value}
                name={this.props.name}
                error={this.props.error}
                type={this.props.type}
                onChange={this.props.onChange}
                ref='field'/>);
    }
});

