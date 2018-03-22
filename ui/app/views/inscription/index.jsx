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
                    <label>L'inscription est réservée aux employés du Centre d'Affaires La Boursidière et est valable du 1er septembre au 31 août. Le prix de la cotisation est de 30€ à renouveler chaque année.</label>
                    <label>Exceptionnellement, toute inscription réglée avant le 1er septembre 2018 sera valable jusqu’au 31 août <div style={{'font-weight':'bold'}}>2019</div></label>
                    </div>
                </Panel>
                <Panel title='Nous rejoindre'>
                    <div data-focus='column'>
                        <label>Un dossier d’inscription doit être retiré au bureau ou téléchargé et doit être rendu dûment rempli et signé.</label>
                        <label>Il comporte les documents ci-dessous :</label>
                        <ul>
                            <li><label>Fiche d'adhésion (à compléter et signer)</label></li>
                            <li><label>Certificat médical (à faire remplir par son médecin traitant - valable 3 ans)</label></li>
                            <li><label>Décharge de responsabilité (à compléter et signer)</label></li>
                            <li><label>Règlement intérieur (à signer)</label></li>
                        </ul>
                        <label>Vous pouvez télécharger votre dossier d'inscription <div className='link' onClick={() => {window.location.href = './Inscription_ASLB.zip'}}>içi</div> </label>
                        <label>Pour les paiement par virement ou PayPal, veuillez a bien lire la fiche d'adhésion.</label>
                    </div>
                </Panel>
            </ScrollspyContainer>
        );
    }
});
