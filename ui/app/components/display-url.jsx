//libraries
import React, {Component, PropTypes} from 'react';


export default React.createClass({
    render() {
        if (this.props.value) {
            return <div data-focus="url">
                {this.props.value}
            </div>;
        }
        return <div></div>;
    }
});
