import React from 'react';
import Panel from 'focus-components/components/panel';
import ScrollspyContainer from 'focus-components/components/scrollspy-container';
import Presentations from './presentations';
import Contact from './contact-asso';
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
                <Panel title='Un problème technique?'>
                    <div data-focus='contact'>
                        <label>
                            Ce site est développé par des volontaires pour l'Association Sportive de La Boursidière
                        </label>
                        <label>
                            Les contributeurs actuels sont :
                        </label>
                        <label>
                            - Dimitri Mockelyn
                        </label>
                        <label>
                            La prestation étant réalisée sur le temps libre et au bon vouloir des contributeurs, il est possible que le site rencontre des problèmes.
                        </label>
                        <label>Vous pouvez les rapporter <a href="mailto:dimitri.mockelyn@gmail.com?subject=Il marche pô ton site lol"> ici (par mail) </a> ou <a href='https://github.com/DimitriMockelyn/ASLB_WEB/issues'>ici (sur GitHub)</a></label>
                        <label>Toutes les suggestions sont les bienvenues. Si vous avez une idée d'amélioration, n'hésitez pas a nous contacter <a href="mailto:aslb@laboursidiere.com?subject=[ASLB] Idée ou remarque">par ici</a></label>
                        <label>Si vous voulez juste laisser un commentaire sur le site proposé, vous pouvez le faire <a href="mailto:aslb@laboursidiere.com?subject=<3">ici</a> s'il est positif, <a href="mailto:noreply-junk@laboursidiere.com?subject=Pas content">ici</a> sinon :)</label>
                    </div>
                </Panel>
            </ScrollspyContainer>
        );
    }
});
