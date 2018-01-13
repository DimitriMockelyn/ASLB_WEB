import React from 'react';
import Panel from 'focus-components/components/panel';
import ScrollspyContainer from 'focus-components/components/scrollspy-container';
import PersPanel from './panel';
import {translate} from 'focus-core/translation';
export default React.createClass({
    displayName: 'PresentationView',

    componentWillMount() {
        this.setState({});
    },
    /** @inheritDoc */
    render() {
        return (
                <Panel title="contact.contactAsso">
                    <div data-focus='display-column'>
                        <label>{translate('contact.contactCourrier')}</label>
                        <label>{translate('contact.contactMail')}</label>
                        <label>{translate('contact.contactPhysique')}</label>
                    </div>
                </Panel>
                
        );
    }
});
