import React from 'react';
// Dependencies

import builder from 'focus-core/component/builder';
import type from 'focus-core/component/types';

// Mixins

import i18nMixin from 'focus-components/common/i18n/mixin';

// Components

import {component as Popin} from 'focus-components/application/popin';
import {component as Button} from 'focus-components/common/button/action';

const ConfirmationPopin = {
    /**
    * Display name.
    */
    displayName: 'confirmation-popin',
    mixins: [i18nMixin],
    getDefaultProps() {
        return {
            open: false,
            cancelButtonLabel: 'popin.confirmation.cancel',
            confirmButtonLabel: 'popin.confirmation.confirm',
            size: 'medium'
        };
    },

    getInitialState() {
        return {
            fromButtonClick: false
        };
    },

    propTypes: {
        cancelButtonLabel: type('string'),
        cancelHandler: type(['func', 'object']),
        confirmButtonLabel: type('string'),
        confirmHandler: type(['func', 'object'])
    },

    /**
    * Confirmation action handler
    */
    _handleConfirm() {
        if (!this.props.validateConfirm || this.props.validateConfirm()) {
            this.toggleOpen();
            if (this.props.confirmHandler) {
                this.props.confirmHandler();
            }
        }
    },

    /**
    * Cancel action handler
    */
    _handleCancel() {
        this.toggleOpen();
        if (this.props.cancelHandler) {
            this.props.cancelHandler();
        }
    },

    _handlePopinClose() {
        if (this.props.cancelHandler && !this.state.fromButtonClick) {
            this.props.cancelHandler();
        }
        this.setState({fromButtonClick: false});
        this.props.onPopinClose && this.props.onPopinClose();
    },
    toggleOpen() {
        this.setState({
            fromButtonClick: true
        }, () => {
            this.refs.popin.toggleOpen();
        });
    },

    render() {
        const typeButton=this.props.type || 'submit';
        return (
            <div data-focus='confirmation-popin'>
                <Popin onPopinClose={this._handlePopinClose} open={this.props.open} ref='popin' size={this.props.size}>
                    {this.props.children}
                    <div data-focus='button-stack'>
                        <Button handleOnClick={this._handleCancel} label={this.i18n(this.props.cancelButtonLabel)} type={typeButton}/>
                        <Button handleOnClick={this._handleConfirm} label={this.i18n(this.props.confirmButtonLabel)} option='primary' type={typeButton}/>
                    </div>
                </Popin>
            </div>
        );
    }
};

module.exports = builder(ConfirmationPopin);
