import React from 'react';
import Panel from 'focus-components/components/panel';
import ScrollspyContainer from 'focus-components/components/scrollspy-container';
import PersPanel from './panel';
import homeServices from '../../services/home';
import {translate} from 'focus-core/translation';
export default React.createClass({
    displayName: 'PresentationView',

    componentWillMount() {
        //this.setState({});
        homeServices.loadBlocs('contactasso').then(res => {
            this.setState({blocs: res});
        })
    },
    toggleMail() {
        window.location.href = 'mailto:aslb@laboursidiere.com';
    },
    /** @inheritDoc */
    render() {
        return (
            <div>
                {this.state && this.state.blocs && this.state.blocs.length > 0 && this.state.blocs.map(value => {
                    return             <Panel title={value.titre}>
                        <div dangerouslySetInnerHTML={{ __html: value.contenu }} />
                    </Panel>
                })}
            </div>
                
        );
    }
});
