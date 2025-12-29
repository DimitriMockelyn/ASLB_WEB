//libraries
import React, {Component, PropTypes} from 'react';


export default React.createClass({
    render() {
            return <a href={'mailto:'+this.props.value}>{this.props.value}</a>;
    }
});
