//libraries
import React, {Component, PropTypes} from 'react';
import moment from 'moment';

export default React.createClass({
    render() {
        if (this.props.value) {
            let date = moment(this.props.value, moment.ISO_8601).format('DD/MM/YYYY');
            if (this.props.options.name) {
                date = date + ' par ' + this.props.options.name;
            }
            return <div>
                {date}
            </div>;
        }
        return <div>
        </div>;
    }
});

