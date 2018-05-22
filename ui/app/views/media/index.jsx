import React from 'react';
import Panel from 'focus-components/components/panel';
import ScrollspyContainer from 'focus-components/components/scrollspy-container';
import homeServices from '../../services/home';
import MediaPanel from './media-panel';
export default React.createClass({
    displayName: 'MediaView',

    componentWillMount() {
        this.setState({});
        homeServices.loadMedias().then(res => {
            this.setState({medias: res});
        })
    },
    /** @inheritDoc */
    render() {
        return (
            <div>
                <label>Média : </label>
                <label>Vous trouverez ici toutes les photos/vidéos des évènements de l'ASLB</label>
                <div>
                    {this.state && this.state.medias && this.state.medias.length > 0 && this.state.medias.map(value => {
                        return <MediaPanel value={value} />
                    })}
                </div>
            </div>
        );
    }
});
