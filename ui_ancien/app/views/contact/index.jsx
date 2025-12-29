import React from 'react';
import Panel from 'focus-components/components/panel';
import ScrollspyContainer from 'focus-components/components/scrollspy-container';
import Presentations from './presentations';
import Contact from './contact-asso';
import ProblemeTechnique from './probleme-technique';

export default React.createClass({
    displayName: 'PartenairesView',

    componentWillMount() {
        this.setState({});
    },
    /** @inheritDoc */
    render() {
        return (
            <ScrollspyContainer>
                <Contact />
                <Presentations />
                <ProblemeTechnique />
            </ScrollspyContainer>
        );
    }
});
