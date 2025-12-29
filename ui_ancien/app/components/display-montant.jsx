//libraries
import React, {Component, PropTypes} from 'react';
import userHelper from 'focus-core/user';

export default React.createClass({
    reverse(value) {
        return value.split('').reverse().join('');
    },
    render() {
        if (this.props.value || this.props.value === 0) {
            return <div>
                {this.reverse(this.reverse(this.props.value.toFixed(0).toString()).replace(/((?:\d{2})\d)/g, '$1 ')) + ' \u20AC'}
            </div>;
        }
        return <div>
            {!userHelper.hasRole(['OF']) && '0 \u20AC'}
            {userHelper.hasRole(['OF']) && '\u20AC'}
        </div>;
    }
});
