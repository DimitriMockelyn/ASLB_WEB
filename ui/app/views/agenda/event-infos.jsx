import React from 'react';
import Calendar from './calendar';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import agendaServices from '../../services/agenda';
import moment from 'moment';
import userHelper from 'focus-core/user';
import confirm from 'focus-core/application/confirm';
import userServices from '../../services/user';
import message from 'focus-core/message';
import EventCard from './event-card';
import {translate} from 'focus-core/translation';

const ConfirmPopup = React.createClass({
    render() {
        return <div data-focus='display-column' className={this.props.tokensRestant === 0 ? 'no-actions' : ''}>
                {this.props.tokensRestant !== 0 && translate('agenda.messageQueue').split('\n').map(data => {
                    return <label>{data}</label>
                })}
                {this.props.tokensRestant === 0 && translate('agenda.messageQueueImpossible').split('\n').map(data => {
                    return <label>{data}</label>
                })}
        </div>
    }
});

export default React.createClass({
    displayName: 'HomeView',
    mixins: [formMixin],
    definitionPath: 'event',
    referenceNames: ['typeEvenements', 'niveauEvenements', 'typeSexe'],
    componentWillMount() {
        this.setState({});

    },
    getInitialState() {
        return {...this.props.event, date_debut : moment(this.props.event.date_debut), animateur: this.props.event && this.props.event.animateur && this.props.event.animateur._id};
    },
    addSelf() {
        if (this.validate()) {
            if (this.props.event.participants.length === this.props.event.limite) {
                confirm(() => { return <ConfirmPopup tokensRestant={this.props.tokensRestant} />}, {cancelButtonLabel: 'button.cancelQueue', confirmButtonLabel: 'button.acceptQueue'}).then(this.trueAddSelf);
            } else { 
                this.trueAddSelf();
            }
        }
    },
    trueAddSelf() {
        agendaServices.addSelfToEvent(this.props.event).then( res => {
            if (res.message) {
                message.addSuccessMessage(res.message);
            }
            this.props.onPopinClose();
        });
    },
    removeSelf() {
        if (this.validate()) {
            agendaServices.removeSelfToEvent(this.props.event).then(this.props.onPopinClose);
        }
    },
    deleteEvent() {
        confirm(i18n.t('event.deleteEventConfirm')).then(() => agendaServices.deleteEvent(this.props.event).then(this.props.onPopinClose));
            //request.execute(function(event) {that.props.onPopinClose()})
    },
    isInEvent(id) {
        for (let index in this.props.event.participants) {
            if (this.props.event.participants[index]._id === id) {
                return true;
            }
        }
        for (let index in this.props.event.fileAttente) {
            if (this.props.event.fileAttente[index].personne.toString() === id.toString()) {
                return true;
            }
        }
        return false;
    },
    isInFile(id) {
        for (let index in this.props.event.fileAttente) {
            if (this.props.event.fileAttente[index].personne.toString() === id.toString()) {
                return true;
            }
        }
        return false;
    },
    computeInfoFile(id) {
        var position = 1;
        var indexOrdre = -1;
        for (let index in this.props.event.fileAttente) {
            if (this.props.event.fileAttente[index].personne.toString() === id.toString()) {
                indexOrdre = index;
            }
        }
        for (let index in this.props.event.fileAttente) {
            if (this.props.event.fileAttente[index].ordre < this.props.event.fileAttente[indexOrdre].ordre) {
                position++;
            }
        }
        return 'Vous etes en position numéro '+position.toString()+' dans la file d\'attente'
    },
    isOwner() {
        return userHelper.getLogin() && this.props.event.createur._id === userHelper.getLogin()._id;
    },
    isAnimateur() {
        return userHelper.getLogin() && this.props.event.animateur._id === userHelper.getLogin()._id;
    },
    update() {
        agendaServices.updateEvent(this._getEntity()).then(() => {
            this.setState({...this._getEntity(),isEdit: !this.state.isEdit});
        })
    },
    renderActionsUpdate() {
        var buttonEdit = <div/>;
        if (this.isOwner()) {
            if (this.state.isEdit) {
                buttonEdit = <Button label='button.save' type='button' handleOnClick={this.update} />
            } else {
                buttonEdit = <Button label='button.edit' type='button' handleOnClick={ () => this.setState({isEdit: !this.state.isEdit})} />;
            }
        }
        var buttonMail = <div/>
        if (this.isAnimateur()) {
            buttonMail = <Button label='button.sendMailParticipants' icon='mail' type='button' handleOnClick={this.sendMailParticipants} />;
        }
        return <div>{buttonEdit} {buttonMail}</div>
    },
    sendMailParticipants() {
        var users =''
        for (let index in this.state.participants) {
            if (users === '') {
                users = this.state.participants[index].email;
            } else {
                users = users + ';'+ this.state.participants[index].email
            }
        }
        window.location.href = 'mailto:'+users;
    },
    computeSexeData(membre) {
        if (!membre.sexe || !this.state.reference || !this.state.reference.typeSexe) {
            return '';
        }
        //'♂';
        if (this.state.reference.typeSexe.find(data => {return data._id === membre.sexe}).code === 'H') {
            return <i className='fa fa-mars'></i>;                
        }
        return <i className='fa fa-venus'></i>; 
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <Panel title='agenda.evenementDetail' actions={this.renderActionsUpdate} >
                {!this.state.isEdit && <EventCard hasForm={false} hasLoad={false} data={this.state} computeSexeData={this.computeSexeData} animateur={this.props.event.animateur}/>}
                {this.state.isEdit && <div>
                    {this.fieldFor('name')}
                    {this.fieldFor('created', {value: this.state.created_date, isEdit: false})}
                    {this.fieldFor('creator', {value: this.state.createur && (this.state.createur.prenom + ' ' + this.state.createur.nom), isEdit: false})}
                    {this.fieldFor('date_debut')}
                    {this.fieldFor('duree')}
                    {this.fieldFor('limite')}
                    {this.fieldFor('animateur',{options: {querySearcherCs: userServices.loadUserAutocomplete, initialString: this.props.event && this.props.event.animateur && this.props.event.animateur.nom + ' ' + this.props.event.animateur.prenom}})}
                    {this.fieldFor('description', {value: this.state.description})}
                    {this.fieldFor('typeEvenement', {listName: 'typeEvenements', isRequired: true, valueKey: '_id', labelKey: 'name'})}
                    {this.fieldFor('niveau', {listName: 'niveauEvenements', valueKey: '_id', labelKey: 'name'})}
                    {this.state.participants && this.state.participants.length > 0 && <div data-focus='participants-list'>
                        <label>{i18n.t('event.participantsList') + ' ('+this.state.participants.length+')'}</label>
                        <div data-focus='list'>
                            {this.state.participants && this.state.participants.length > 0 && this.state.participants.map(value => {
                                return <div>{value.nom + ' ' + value.prenom}<div>{this.computeSexeData(value)}</div></div>
                            })}
                        </div>
                    </div>}
                </div>}
                {userHelper.getLogin() &&  this.isInFile(userHelper.getLogin()._id) && <div>
                        {this.computeInfoFile(userHelper.getLogin()._id)}
                    </div>}
                
                {userHelper.getLogin() && !this.isInEvent(userHelper.getLogin()._id) && <div>
                    <Button label='event.addSelf' type='button' handleOnClick={this.addSelf} />
                </div>}

                {userHelper.getLogin() && this.isInEvent(userHelper.getLogin()._id) && <div>
                    <Button label='event.removeSelf' type='button' handleOnClick={this.removeSelf} />
                </div>}
                {this.isOwner() && <div>
                    <Button label='event.deleteEvent' type='button' handleOnClick={this.deleteEvent} />
                </div>}
            </Panel>
        </div>
        );
    }
});
