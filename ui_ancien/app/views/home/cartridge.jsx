//librairies
import React, {PropTypes} from 'react';

import homeServices from '../../services/home';
import {component as BackButton} from 'focus-components/common/button/back';
import {navigate} from 'focus-core/history';
import userHelper from 'focus-core/user';
import {component as Popin} from 'focus-components/application/popin';
import Panel from 'focus-components/components/panel';
export default React.createClass({
    componentWillMount() {
        homeServices.loadBlocs('partenaire').then(res => {
            this.setState({blocs: res});
        })
    },
    getInitialState() {
        return {}
    },
    togglePopin() {
        this.setState({togglePopinExplication: true});
    },
    closeExplications() {
        this.setState({togglePopinExplication: false});
    },
    togglePopinPartenaire() {
        this.setState({showPopinPartenaire: true});
    },
    closePopinPartenaire() {
        this.setState({showPopinPartenaire: false});
    },
    render() {
        return <div>
            <div data-focus='cartridge-home'>
                <label>
                Association <div className='blue-aslb'>S</div>portive La Boursidière
                </label>
                <label>
                Le sport loisirs au sein du Centre d'Affaires de La Boursidière
                </label>    
            </div>
            <div data-focus='button-header-cst'>
                <div className='header-tile-click' onClick={() => {navigate('inscription', true)}}>
                    <label>
                        Devenir membre
                    </label>
                </div>
                <div className='header-tile-click' onClick={() => {navigate('contact', true)}}>
                    <label>
                        Nous contacter
                    </label>
                </div>
                <div className='header-tile-click' onClick={() => {userHelper.getLogin() ? navigate('historiqueAnimation', true) : this.togglePopin()}}>
                    <label>
                        Rejoindre l'équipe d'animation ?
                    </label>
                </div>
                <div className='header-tile-click' onClick={this.togglePopinPartenaire}>
                    <label>
                        Devenir partenaire
                    </label>
                </div>
            </div>
            {this.state.togglePopinExplication && <Popin size='small' open={true} onPopinClose={this.closeExplications}>
                        <div data-focus='display-column'>
                            <label>{i18n.t('historique.notCoachYet')}</label>
                            <label>{i18n.t('historique.howToCoach')}</label>
                            <label>{i18n.t('historique.coachBenefits')}</label>
                            <label>{i18n.t('historique.coachContact')}</label>
                            <label>{i18n.t('historique.signature')}</label>
                        </div>
                    </Popin>}
            {this.state.showPopinPartenaire && <Popin open={true} onPopinClose={this.closePopinPartenaire} >
            <div>
                {this.state && this.state.blocs && this.state.blocs.length > 0 && <Panel title={this.state.blocs[0].titre}>
                        <div dangerouslySetInnerHTML={{ __html: this.state.blocs[0].contenu }} />
                    </Panel>
                }
            </div>
            </Popin>}
        </div>;
    }
});
