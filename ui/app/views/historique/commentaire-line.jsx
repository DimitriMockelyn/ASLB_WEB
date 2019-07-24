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

import Textarea from 'focus-components/components/input/textarea';

export default React.createClass({
    displayName: 'CommentaireLine',
    getInitialState() {
        return {showAnswer: false, reponse: ''};
    },
    toggleAnswer() {
        this.setState({showAnswer: !this.state.showAnswer});
    },
    onRaisonChange(value) {
        this.setState({reponse: value});
    },
    sendReponse() {
        agendaServices.postReponseCommentaire({reponse: this.state.reponse, idCommentaire: this.props.data._id, idEvent: this.props.data.evenement._id || this.props.data.evenement}).then(() => {
            message.addSuccessMessage(i18n.t('event.commentairePoste'))
            this.setState({showAnswer: false, reponse: ''});
            this.props.reload();
        });
    },
    /** @inheritDoc */
    render() {
        console.log(this.props);
        let data = this.props.data;
        return (
                <div data-focus='commentaire-detail'>
                    {data.note && <Note value={data.note} editing={false} />}
                    <div data-focus='commentaire-commentaire'>
                        <label>{data.commentaire || ''}</label>
                        <div className='link' onClick={this.toggleAnswer}>Rèpondre</div>
                        {this.state.showAnswer && <div data-focus='display-row'>
                            <Textarea onChange={this.onRaisonChange} placeHolder='Entrez votre réponse' value={this.state.reponse} style={{'width': '250px'}}/>
                            <Button handleOnClick={this.sendReponse} label='Envoyer' type={'button'}/>
                        </div>}
                        {data.children && data.children.length > 0 && data.children.map(child => {
                            return <this.props.CommentaireLineComp data={child} reload={this.props.componentWillMount} CommentaireLineComp={this.props.CommentaireLineComp}/>
                        })}
                    </div>
                    <div data-focus='commentaire-auteur'>{data.auteur.prenom + ' ' + data.auteur.nom + ' (' + moment(data.date, moment.ISO_8601).format('DD/MM/YYYY - HH:mm') +')'}</div>
                </div>
                )
    }
});
