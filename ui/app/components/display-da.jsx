//libraries
import React, {Component, PropTypes} from 'react';


export default React.createClass({
    render() {
        if (this.props.value) {
            return <div>
                {this.props.value.toString().replace(/(\d{2})(\d{2})(\d{5})(\d{2})/g, '$1 $2 $3 $4')}
            </div>;
        }
        return <div></div>;
    }
});

