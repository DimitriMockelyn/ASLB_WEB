//libraries
import React, {Component, PropTypes} from 'react';


export default React.createClass({
    render() {
        if (this.props.value && this.props.value.length === 11) {
            return <div>
                {this.props.value.substring(0,2)+ ' '+this.props.value.substring(2,4)+ ' '+this.props.value.substring(4,9)
                + ' '+this.props.value.substring(9,11)}
            </div>;
        }
        return <div>
            {i18n.t('empty.numeroDa')}
        </div>;
    }
});

