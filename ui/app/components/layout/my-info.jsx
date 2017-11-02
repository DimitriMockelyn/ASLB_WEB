//libraries
import React, {Component, PropTypes} from 'react';
import userHelper from 'focus-core/user';

export default React.createClass({
    render() {
        var me = userHelper.getLogin();
        return <div data-focus='me-panel'>
            <label>{me.prenom + ' '+ me.nom + ' (' + me.email + ')'}</label>
            
        </div>;
    }
});
