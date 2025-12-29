import React from 'react';
import homeServices from '../../services/home';
import PartenairePanel from './partenaire-panel';
import Panel from 'focus-components/components/panel';
import {component as Popin} from 'focus-components/application/popin';
export default React.createClass({
    displayName: 'PartenairesView',

    componentWillMount() {
        this.setState({});
        homeServices.loadPartenaires().then(res => {
            this.setState({partenaires: res});
        })
        homeServices.loadBlocs('partenaire').then(res => {
            this.setState({blocs: res});
        })
    },
    togglePopinPartenaire() {
        this.setState({showPopin: true});
    },
    closePopinPartenaire() {
        this.setState({showPopin: false});
    },
    /** @inheritDoc */
    render() {
        return (
        <div>
            <div data-focus='display-row'>
                <label style={{'margin-left': '20px'}}>{i18n.t('partenaires.description')}</label>
                <div className='link' style={{'margin-left': '20px'}} onClick={this.togglePopinPartenaire} size='small'> Devenir partenaire</div>
            </div>
            <div>
                {this.state && this.state.partenaires && this.state.partenaires.length > 0 && this.state.partenaires.map(value => {
                    return <PartenairePanel value={value} />
                })}
            </div>
            {this.state.showPopin && <Popin open={true} onPopinClose={this.closePopinPartenaire} >
            <div>
                {this.state && this.state.blocs && this.state.blocs.length > 0 && <Panel title={this.state.blocs[0].titre}>
                        <div dangerouslySetInnerHTML={{ __html: this.state.blocs[0].contenu }} />
                    </Panel>
                }
            </div>
            </Popin>}
        </div>
        );
    }
});
