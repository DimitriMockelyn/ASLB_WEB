import { SketchPicker  } from 'react-color';
import React, {Component, PropTypes} from 'react';

export default React.createClass({
    getValue(){
        return 'rgba('+this.state.color.r+','+this.state.color.g+','+this.state.color.b+','+this.state.color.a+')';
    },
    getInitialState() {
        let values = this.props.value;
        if (!values) {
            return {color: {}}
        }
        values = values.replace('rgba(', '');
        values = values.replace(')', '');
        values = values.split(',');
        return {
            color: {
                r: values[0],
                g: values[1],
                b: values[2],
                a: values[3]
            }
        }
    },
    handleChange(key) {
        this.setState({color: key.rgb}, () => {
        if (this.props.onChange) {
            this.props.onChange(this.getValue())
        }
    });
    },
    render() {
        return (
            <SketchPicker color={ this.state.color } onChange={ this.handleChange } />
        );
    }
});