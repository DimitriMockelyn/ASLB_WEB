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
            <ScrollspyContainer>
                <div data-focus='inscription-title'>
                <label>S'inscrire à l'ASLB</label>
                </div>
                <Panel title='Conditions'>
                    <div data-focus='column'>
                        <label>L'inscription est réservée aux employés du Centre d'Affaires La Boursidière.</label>
                        <label>Le prix de l'inscription, valable jusqu'au prochain 31 août à compter de la date d'inscription, est fixé à 30€</label>
                        <label>Les inscription en 2017 seront valable, exceptionnellements, jusqu'au 31 août 2019</label>
                    </div>
                </Panel>
                <Panel title='Nous rejoindre'>
                    <div data-focus='column'>
                        <label>Les pièces justificatives à présenter pour votre inscription sont les suivantes</label>
                        <ul>
                            <li><label>Fiche d'adhésion complétée</label></li>
                            <li><label>Certificat médical</label></li>
                            <li><label>Décharge de responsabilité</label></li>
                        </ul>
                        <label>Vous pouvez télécharger votre dossier d'inscription a compléter <div className='link' onClick={() => {window.location.href = './Inscription_ASLB.zip'}}>içi</div> </label>
                    </div>
                </Panel>
            </ScrollspyContainer>
        );
    }
});
