//libraries
import React, {Component, PropTypes} from 'react';


export default React.createClass({
    render() {
        if (this.props.value && (this.props.value.length === 14 || this.props.value.length === 9) ) {
            return <div>
                {this.props.value.substring(0,9)+ ' '+this.props.value.substring(9,14)}
            </div>;
        }
        return <div>
            {i18n.t('empty.siret')}
        </div>;
    }
});

