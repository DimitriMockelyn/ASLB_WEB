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
    toggleMail() {
        window.location.href = 'mailto:aslb@laboursidiere.com';
    },
    /** @inheritDoc */
    render() {
        return (
                <Panel title="contact.contactAsso">
                    <div data-focus='display-column'>
                        <label>{translate('contact.contactGeneral')}</label>
                        <div data-focus='display-row'>
                        <label>{translate('contact.contactCourrier')} </label><div className='bold'> ASSOCIATION SPORTIVE LA BOURSIDIÈRE, LA BOURSIDIERE, 92350 Plessis-Robinson.</div>
                        </div>
                        <div data-focus='display-row'>
                        <label>{translate('contact.contactMail')} </label><div className='bold'> </div><div className='link bold' onClick={this.toggleMail}>aslb@laboursidiere.com</div>
                        </div>
                        <label>{translate('contact.contactPhysique')}</label>
                        <div data-focus='img-acces' />
                    </div>
                </Panel>
                
        );
    }
});
