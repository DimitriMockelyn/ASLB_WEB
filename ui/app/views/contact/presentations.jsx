import React from 'react';
import Panel from 'focus-components/components/panel';
import ScrollspyContainer from 'focus-components/components/scrollspy-container';
import PresentationPerson from './presentation-person';
export default React.createClass({
    displayName: 'PresentationView',

    componentWillMount() {
        this.setState({});
    },
    /** @inheritDoc */
    render() {
        return (
                <Panel title="contact.presentationMembres">
                    <div data-focus='contact'>
                        <label>
                            Les membres du bureau actuel sont :
                        </label>
                        <PresentationPerson baseFr='stephaneMartin' portrait='https://dgalywyr863hv.cloudfront.net/pictures/athletes/10015096/3020222/6/large.jpg'/>
                        <PresentationPerson baseFr='guillaumeBlanchard' portrait='https://dgalywyr863hv.cloudfront.net/pictures/athletes/21091550/7637844/1/large.jpg' /> 
                        <PresentationPerson baseFr='dimitriMockelyn' portrait='https://dgalywyr863hv.cloudfront.net/pictures/athletes/23700855/6809599/2/large.jpg'/>
                    </div>
                </Panel>
                
        );
    }
});
