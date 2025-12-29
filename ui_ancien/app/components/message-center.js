import React, {Component, PropTypes} from 'react';
import capitalize from 'lodash/string/capitalize';
import messageStore from 'focus-core/message/built-in-store';
import {component as Button} from 'focus-components/common/button/action';
import {translate} from 'focus-core/translation';

const defaultProps = {
    ttlError: 8000,
    ttlInfo: 3000,
    ttlSuccess: 3000,
    ttlWarning: 3000
};

const propTypes = {
    ttlError: PropTypes.number.isRequired,
    ttlInfo: PropTypes.number.isRequired,
    ttlSuccess: PropTypes.number.isRequired,
    ttlWarning: PropTypes.number.isRequired
};

const CONSTANT = {
    ANIMATION_LENGTH: 250
};

export default React.createClass({
    defaultProps,
    propTypes,
    displayName : 'message-center',
    cleanupTimeout : null,
    currentNotification : null,
    queuedNotifications : [],
    getInitialState() {
       return  { active: false };
    },

    /** @inheriteddoc */
    componentWillMount() {
        messageStore.addPushedMessageListener(this._handlePushMessage);
    },
    /** @inheriteddoc */
    componentWillUnmount() {
        messageStore.removePushedMessageListener(this._handlePushMessage);
    },
    /**
     * Check if the queue has items within it.
     * If it does, display the next entry.
     *
     * @private
     */
    _checkQueue() {
        if (this.queuedNotifications.length > 0) {
            this.showSnackbar(this.queuedNotifications.shift());
        }
    },

    /**
     * Remove cleanupTimeout
     * @return {[type]} [description]
     */
    _forceCleanup() {
        clearTimeout(this.cleanupTimeout);
        this._cleanup();
    },

    /**
     * Cleanup the snackbar event listeners and accessiblity attributes.
     *
     * @private
     */
    _cleanup() {
        this.cleanupTimeout = null;
        this.setState({ active: false });
        setTimeout(() => {
            this._checkQueue();
        }, CONSTANT.ANIMATION_LENGTH);
    },

    /**
     * Push a new message into snackbar.
     * @type {number} message id.
     */
    _handlePushMessage(messageId) {
        const message = messageStore.getMessage(messageId);
        const {content, action, type} = message;
        const ttl = this.props[`ttl${capitalize(type)}`];
        const notificationData = {
            type,
            message: content,
            timeout: ttl
        };
        if(action) {
            notificationData['actionText'] = action.text;
            notificationData['actionHandler'] = action.handler;
        }
        this.showSnackbar(notificationData);
    },

    /** @inheritDoc */
    render() {
        const { active} = this.state;
        const notification = this.currentNotification || {};
        const { actionText, actionHandler, message, type } = notification;
        const classNames = `mdl-snackbar ${active ? 'mdl-snackbar--active' :  ''}`;
        const otherProps = { 'aria-hidden': active, 'aria-live':'assertive', 'aria-atomic':'true', 'aria-relevant': 'text' };
        return (
            <div data-focus='snackbar-message-center' data-message-type={type} className={classNames} {...otherProps}>
                <div className='mdl-snackbar__text'>{translate(message)}</div>
                {actionText &&
                <button className='mdl-snackbar__action' type='button' onClick={actionHandler}>{translate(actionText)}</button>
                }
                <button className='mdl-snackbar__close' type='button' onClick={this._forceCleanup}><i className='material-icons'>clear</i></button>
            </div>
        );
    },

    /**
     * Show the snackbar.
     *
     * @param {Object} data The data for the notification.
     * @public
     */
    showSnackbar(data) {
        if (data === undefined) {
            throw new Error('Please provide a data object with at least a message to display.');
        }
        if (data['message'] === undefined) {
            throw new Error('Please provide a message to be displayed.');
        }
        if (data['actionHandler'] && !data['actionText']) {
            throw new Error('Please provide action text with the handler.');
        }
        const {active} = this.state;
        if (active) {
            this._cleanup();
            this.queuedNotifications.push(data);
        } else {
            this.currentNotification = data;
            this.setState({ active: true });
            this.cleanupTimeout = setTimeout(this._cleanup, data.timeout);
        }
    }
});
