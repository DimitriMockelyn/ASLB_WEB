import React from 'react';
import {getConfig} from '../../config';
import {component as Popin} from 'focus-components/application/popin';
import MentionsLegales from './mentions-legales';
export default React.createClass({
    displayName: 'Footer',
    togglePopinMention() {
        this.refs.mention.toggleOpen();
    },
    render() {
        const ver = getConfig().VERSION;
        return (
            <div data-focus="footer">
                <div data-focus="scrolling-popin">
                <Popin ref='mention'>
                    <MentionsLegales/>
                </Popin>
                </div>
                <div data-focus="mention-legales" onClick={this.togglePopinMention}>Mention legales</div>
                <div>v {ver} <div data-focus="logo"/></div>
            </div>
        );
    }
});
