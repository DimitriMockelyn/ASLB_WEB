import React from 'react';
import Panel from 'focus-components/components/panel';
import ScrollspyContainer from 'focus-components/components/scrollspy-container';
import PresentationPerson from './presentation-person';
import homeServices from '../../services/home';
import PersPanel from './panel';
export default React.createClass({
    displayName: 'PresentationView',

    componentWillMount() {
        this.setState({});
        this.loadAllPresentations();
    },
    loadAllPresentations() {
        homeServices.loadPresentations().then(res => {this.setState({membres: res})});
    },
    /** @inheritDoc */
    render() {
        /*
            display: flex;
            flex-wrap: wrap;
        */
        return (
                <Panel title="contact.presentationMembres">
                    <div data-focus='contact'>
                        <label>
                            Les membres du bureau actuel sont :
                        </label>
                        <div data-focus='tiles-container'>
                        {this.state.membres && this.state.membres.map(value => {
                            if (value.isBureau) {
                                return <PersPanel value={value} />;
                            }   
                        })}
                        </div>
                        <label>
                            Les membres de l'équipe d'animation sont :
                        </label>
                        <div data-focus='tiles-container'>
                        {this.state.membres && this.state.membres.map(value => {
                            if (!value.isBureau) {
                                return <PersPanel value={value} />
                            }   
                        })}
                        </div>
                    </div>
                </Panel>
                
        );
    }
});
