import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import moment from 'moment';
import userHelper from 'focus-core/user';
import confirm from 'focus-core/application/confirm';
import agendaServices from '../../services/agenda';
import message from 'focus-core/message';

export default React.createClass({
    displayName: 'CommentairePanel',
    mixins: [formMixin],
    definitionPath: 'event',
    componentWillMount() {
        agendaServices.loadCommentaire(this.props.data._id).then(res => { this.setState(res)});
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
                    {(this.props.data.typeEvenement ? this.props.data.typeEvenement.name : '') + ' - ' + this.props.data.name}
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
            <Button label={this.state.commentairePresent ? 'event.editComment' : 'event.createComment'} type='button' handleOnClick={this.postComment} />
        </div>
        );
    }
});
