import React from 'react';
import Panel from 'focus-components/components/panel';
import ScrollspyContainer from 'focus-components/components/scrollspy-container';

export default React.createClass({
    displayName: 'MediaView',

    componentWillMount() {
        this.setState({});
    },
    /** @inheritDoc */
    render() {
        return (
            <div>
                <label>Média : </label>
                <label>Vous trouverez ici toutes les photos/vidéos des évènements de l'ASLB</label>
            </div>
        );
    }
});
