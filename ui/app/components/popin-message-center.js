import React, {Component, PropTypes} from 'react';
import capitalize from 'lodash/string/capitalize';
import messageStore from 'focus-core/message/built-in-store';
import {component as Button} from 'focus-components/common/button/action';
import {translate} from 'focus-core/translation';
import PopinError from './popin-error.jsx';


export default React.createClass({
    displayName: 'PopinMessageCenter',
    componentDidMount() {
        window.togglePopinError = this.togglePopinWithMessage(this.refs['popin-message']);
    },
    togglePopinWithMessage(elt) {
        return msg => {
            elt.toggleOpen(msg);
        };
    },
    /** @inheritDoc */
    render() {
        return (
            <div >
                <PopinError ref='popin-message' />
            </div>
        );
    }
});
