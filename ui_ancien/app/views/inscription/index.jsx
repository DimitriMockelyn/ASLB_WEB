import React from 'react';
import Panel from 'focus-components/components/panel';
import ScrollspyContainer from 'focus-components/components/scrollspy-container';
import homeServices from '../../services/home';

export default React.createClass({
    displayName: 'MediaView',

    componentWillMount() {
        homeServices.loadBlocs('inscription').then(res => {
            this.setState({blocs: res});
        })
    },
    /** @inheritDoc */
    render() {
        return (
            <ScrollspyContainer>
                <div data-focus='inscription-title'>
                <label>S'inscrire à l'ASLB</label>
                </div>
                {this.state && this.state.blocs && this.state.blocs.length > 0 && this.state.blocs.map(value => {
                    return             <Panel title={value.titre}>
                        <div dangerouslySetInnerHTML={{ __html: value.contenu }} />
                    </Panel>
                })}
                
            </ScrollspyContainer>
        );
    }
});
