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
                        <label>Téléchargez <div className='link boldbig' onClick={() => {window.location.href = './Inscription_ASLB.zip'}}>içi</div> votre dossier d'inscription</label>
                        <label>La première étape avant toute inscription est de s’assurer que vous disposez bien d’un certificat médical. Prenez rendez-vous chez votre médecin si vous n’en avez pas.</label>
                        <label>Le dossier d’inscription comporte les documents ci-dessous :</label>
                        <ul>
                            <li><label>Fiche d'adhésion (à compléter et signer)</label></li>
                            <li><label>Certificat médical (à faire remplir par son médecin traitant - valable 3 ans)</label></li>
                            <li><label>Décharge de responsabilité (à compléter et signer)</label></li>
                            <li><label>Règlement intérieur (à parapher sur chaque page et à signer sur la dernière page)</label></li>
                        </ul>
                        
                        <label>
                            Vous pouvez déposer votre dossier d’inscription complété dans la boîte aux lettres de l’ASLB (n°101). Elle se trouve dans la salle La Poste (demander sa localisation à l’accueil)
                        </label>
                        <label>
                                La cotisation annuelle est de 30 € et peut être payée en liquide, par chèque (à l’ordre de l’ASLB), par virement (IBAN fourni dans la fiche d’adhésion) ou par Paypal (cf fiche d’adhésion). . 
                        </label>
                        <label>
                            Les paiements par virement ou PayPal sont vivement encouragés, car ils n’engendrent pas de manutention. 
                        </label>
                    </div>
                </Panel>
            </ScrollspyContainer>
        );
    }
});
