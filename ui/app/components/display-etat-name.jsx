//libraries
import React, {Component, PropTypes} from 'react';
import moment from 'moment';

export default React.createClass({
    render() {
        if (this.props.options.valeur) {
            let val = this.props.options.valeur;
            if (this.props.options.date) {
                val = val + ' le ' + moment(this.props.options.date, moment.ISO_8601).format('DD/MM/YYYY');
            }
            return <div>
                {val}
            </div>;
        }
        return <div>
        </div>;
    }
});
