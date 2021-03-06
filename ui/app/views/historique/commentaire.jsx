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
import {translate} from 'focus-core/translation';
import CommentaireLine from './commentaire-line';
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
        if (this.state && this.state.listeCommentaires && this.state.listeCommentaires.length > 0) {
            for (let index in this.state.listeCommentaires) {
                let comm = this.state.listeCommentaires[index];
                if (comm.note) {
                    this.noteMoyenne = (this.noteMoyenne*this.nbNote+comm.note)/(this.nbNote+1);
                    this.nbNote = this.nbNote +1;
                }
                if (comm.commentaire) {
                    this.nbCommentaires++;
                }
            }
        }
        this.setState({updated: true});
    },
    componentWillMount() {
        agendaServices.loadCommentaire(this.props.data._id).then(res => { this.setState(res, this.computeNote)});
    },
    postComment() {
        if (this._validate()) {
            agendaServices.postCommentaire({data: this._getEntity(), idEvent: this.props.data._id}).then(() => {
                message.addSuccessMessage(i18n.t('event.commentairePoste'))
                this.props.onPopinClose();
            });
        }
    },
    customValidation() {
        let data = this._getEntity();
        if (!data.note && !data.commentaire) {
            message.addErrorMessage(i18n.t('event.commentaireVide'));
            return false;
        }
        return true;
    },
    /** @inheritDoc */
    renderContent() {
        var limitString = this.props.data.limite ?  '/' + this.props.data.limite : '';
        return (
        <div>
                <div>
                    <div>
                    {(this.props.data.typeEvenement ? this.props.data.typeEvenement.name : '') + ' - ' + this.props.data.name}
                    </div>
                    <div>
                        {'Animé par '+(this.props.data.animateur ? this.props.data.animateur.prenom + ' ' + this.props.data.animateur.nom : '')}
                        {this.props.data.coanimateurs && this.props.data.coanimateurs.map(coanim => {
                            return ' et ' + (coanim ? coanim.prenom + ' ' + coanim.nom : '');
                        })}
                    </div>
                </div>
            <div>
                    {this.props.data.description}
                </div>
                

                <div data-focus='news-info'>
                    <div>{i18n.t('admin.eventAt') + ' ' + moment(this.props.data.date_debut, moment.ISO_8601).format('DD/MM/YYYY - HH:mm') + ' - ' +
                     i18n.t('event.duree') + ' ' + this.props.data.duree + ' - ' +
                     i18n.t('admin.nbInscrits') + ' ' + this.props.data.participants.length + limitString} </div>
                </div>
            {this.fieldFor('note', {isEdit: true})}
            {this.fieldFor('commentaire', {isEdit: true})}
            {this.fieldFor('prive', {isEdit: true})}
            <div data-focus='news-info'>
                {translate('event.explainPrive')}
            </div>
            <Button label={this.state.commentairePresent ? 'event.editComment' : 'event.createComment'} type='button' handleOnClick={this.postComment} />

            <div data-focus='commentaire-public'>
                <div data-focus='header-commentaire'>
                {this.nbNote !== 0 && <div data-focus='display-row'>
                    {i18n.t('event.noteMoyenne') + ' ' + this.noteMoyenne + '/5 ( ' + this.nbNote + ' note(s) )' }
                    <Note value={this.noteMoyenne} editing={false} name={this.noteMoyenne + '/5'}/>
                    </div>}
                {!this.nbNote && <div>{i18n.t('event.noNotes')}</div>}
                {<div>
                    {this.nbCommentaires + ' commentaire(s)'}    
                </div>}
                </div>
                <div data-focus='list-commentaire'>
                    <div data-focus='commentaire-coach'>
                {this.state && this.state.listeCommentaires && this.state.listeCommentaires.length > 0 && this.state.listeCommentaires.map(data => {
                    return <CommentaireLine data={data} reload={this.componentWillMount} CommentaireLineComp={CommentaireLine}/>
                })}
                </div>
                </div>
            </div>
        </div>
        );
    }
});
