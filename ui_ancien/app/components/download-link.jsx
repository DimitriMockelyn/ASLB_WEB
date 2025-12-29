//libraries
import React, {Component, PropTypes} from 'react';


export default React.createClass({
    dowload() {
        window.location.href=this.props.url;
    },
    render() {
        return (
            <div onClick={this.dowload}>
                {this.props.value}
            </div>);
    }
});

