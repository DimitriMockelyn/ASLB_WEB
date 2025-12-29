//libraries
import React, {Component, PropTypes} from 'react';
import {component as Popin} from 'focus-components/application/popin';

export default React.createClass({
    getInitialState() {
        return {};
    },
    toggleOpen(msg) {
        this.setState({message:msg});
        this.refs.popin.toggleOpen();
    },
    render() {

            return <div>
                <Popin ref='popin'>
                    <div data-focus="display-row">
                    <i className="material-icons" data-focus="color-error">info_outline</i>
                        <div data-focus="message-container-error">
                    {this.state.message && this.state.message.split('\n').map(elt => {
                        return <div>{elt}</div>;
                    })}
                            </div>
                        </div>
                </Popin>
            </div>;
    }
});

