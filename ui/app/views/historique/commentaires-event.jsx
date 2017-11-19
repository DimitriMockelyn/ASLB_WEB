import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import moment from 'moment';
import userHelper from 'focus-core/user';
import confirm from 'focus-core/application/confirm';
import agendaServices from '../../services/agenda';
import message from 'focus-core/message';
import Note from '../../components/note';
export default React.createClass({
    displayName: 'CommentairePanel',
    mixins: [formMixin],
    definitionPath: 'event',
    noteMoyenne : 0.0,
    nbNote: 0,
    nbCommentaires : 0,
    computeNote() {
        this.noteMoyenne = 0.0;
        this.nbNote = 0;
        this.nbCommentaires = 0;
        console.log(this.props.data);
        if (this.props.data.commentaires) {
            for (let index in this.props.data.commentaires) {
                let comm = this.props.data.commentaires[index];
                if (comm.note) {
                    this.noteMoyenne = (this.noteMoyenne*this.nbNote+comm.note)/(this.nbNote+1);
                    this.nbNote = this.nbNote +1;
                }
                if (comm.commentaire) {
                    this.nbCommentaires++;
                }
            }
        }
    },
    componentWillMount() {
        this.computeNote();
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <div data-focus='commentaire-coach'>
                {this.nbNote !== 0 && <div>
                    {i18n.t('event.noteMoyenne') + ' ' + this.noteMoyenne + '/5 ( ' + this.nbNote + ' note(s) )' }
                    <Note value={this.noteMoyenne} editing={false} name={this.noteMoyenne + '/5'}/>
                    </div>}
                {!this.nbNote && <div>{i18n.t('event.noNotes')}</div>}
                {<div>
                    {this.nbCommentaires + ' commentaire(s)'}    
                </div>}
                {this.props.data.commentaires && this.props.data.commentaires.length > 0 && this.props.data.commentaires.map(data => {
                    return <div data-focus='commentaire-detail'>
                            {data.note && <Note value={data.note} editing={false} />}
                            <div data-focus='commentaire-commentaire'><label>{data.commentaire || ''}</label></div>
                            <div data-focus='commentaire-auteur'>{data.auteur.prenom + ' ' + data.auteur.nom + ' (' + moment(data.date, moment.ISO_8601).format('DD/MM/YYYY - HH:mm') +')'}</div>
                        </div>
                })}
            </div>
        </div>
        );
    }
});
