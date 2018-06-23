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
import Autocomplete from '../../components/autocomplete-field';
import {download} from '../../utils/download';
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
    componentWillReceiveProps() {
        this.setState({updated: !this.state.updated});
    },
    getInitialState() {
        let complement = {};
        if (this.props.event.coanimateurs && this.props.event.coanimateurs.length > 0) {
            this.props.event.coanimateurs.map((data,index) => {
                complement['coanimateur'+index] = data;
            })
        }
        return {...this.props.event, ...complement,
            date_debut : moment(this.props.event.date_debut), 
            animateur: this.props.event && this.props.event.animateur && this.props.event.animateur._id
        };
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
            if (this.props.event.fileAttente[index].personne._id.toString() === id.toString()) {
                return true;
            }
        }
        return false;
    },
    isInFile(id) {
        for (let index in this.props.event.fileAttente) {
            if (this.props.event.fileAttente[index].personne._id.toString() === id.toString()) {
                return true;
            }
        }
        return false;
    },
    computeInfoFile(id) {
        var position = 1;
        var indexOrdre = -1;
        for (let index in this.props.event.fileAttente) {
            if (this.props.event.fileAttente[index].personne._id.toString() === id.toString()) {
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
        let entity = this._getEntity();
        if (entity.coanimateurs && entity.coanimateurs.length > 0) {
            let newArray = [];
            entity.coanimateurs.map((anim, index) => {
                if (entity['coanimateur'+index]) {
                    newArray.push(entity['coanimateur'+index]);
                }
            });
            entity.coanimateurs = newArray;
        } else {
            entity.coanimateurs = [];
        }
        agendaServices.updateEvent(entity).then((res) => {
            this.props.onPopinClose({reopen: this.props.event._id});
        })
    },
    renderActionsUpdate() {
        var buttonEdit = <div/>;
        if (this.isOwner() || this.isAnimateur()) {
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
        var buttonInvite = <div />;
        if (userHelper.getLogin() && this.isInEvent(userHelper.getLogin()._id) ) {
            buttonInvite = <div>
            <Button label='event.generateAppointment' type='button' shape='icon' icon='add_alarm' handleOnClick={this.generateAppointment} />
        </div>
        }

        var buttonMailAppoint = <div/>;
        if (false && userHelper.getLogin() && this.isInEvent(userHelper.getLogin()._id)) {
            buttonMailAppoint = <div>
            <Button label='event.sendMailAppointment' type='button' shape='icon' icon='move_to_inbox' handleOnClick={this.sendMailAppointment} />
        </div>
        }
        return <div data-focus='display-row'>{buttonInvite} {buttonMailAppoint} {buttonEdit} {buttonMail} </div>
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
    addCoAnim() {
        let state = this.state;
        let entity = this._getEntity();
        state.coanimateurs.map((data,index) => {
            state.coanimateurs[index] = entity['coanimateur'+index];
        })
        state.coanimateurs.push(undefined);
        this.setState(state);
    },
    removeCoAnim(index) {
        let that = this;
        return () => {
            let state = that.state;
            let entity = this._getEntity();
            state.coanimateurs.map((data,index2) => {
                let initStr = that.refs['event.coanimateur'+index2].refs.input.refs.autocompleteComponent.refs.autocomplete.state.inputValue;
                if (!entity['coanimateur'+index2] || entity['coanimateur'+index2]._id) {
                    state.coanimateurs[index2] = entity['coanimateur'+index2];
                } else {
                    state.coanimateurs[index2] = {_id :entity['coanimateur'+index2], nom: initStr, prenom: ''};
                }
            })
            for (let index2 in that.state.coanimateurs) {
                state['coanimateur'+index2] = undefined;
            }
            
            state.coanimateurs.splice(index, 1);
            let complement = {};
            state.coanimateurs.map((data,index2) => {
                complement['coanimateur'+index2] = data ? data._id : undefined;
            })
            that.setState({...state, ...complement});
        }
    },
    generateAppointment() {
        agendaServices.generateAppointment(this.props.event).then(res => {download(res.iCal, 'aslb.ics', 'text/calendar')});
    },
    sendMailAppointment() {
        agendaServices.sendMailAppointment(this.props.event).then( res => {message.addSuccessMessage(translate('event.appointmentSent'));});
    },
    /*
                        {this.fieldFor('coanimateur1', {label: 'Co-Animateur',options: {
                        FieldComponent: Autocomplete,
                        querySearcherCs: userServices.loadUserAutocomplete, 
                        initialString: this.props.event && this.props.event.coanimateur && this.props.event.coanimateur.length > 0 && this.props.event.coanimateur[0].nom + ' ' + this.props.event.coanimateur[0].prenom}})}
    */

    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <Panel title='agenda.evenementDetail' actions={this.renderActionsUpdate} >
                {!this.state.isEdit && <EventCard hasForm={false} hasLoad={false} data={this.state} computeSexeData={this.computeSexeData} animateur={this.state.animateurUpdate || this.props.event.animateur} coanimateurs={this.state.coanimateursUpdate || this.props.event.coanimateurs}/>}
                {this.state.isEdit && <div>
                    {this.fieldFor('name')}
                    {this.fieldFor('created', {value: this.state.created_date, isEdit: false})}
                    {this.fieldFor('creator', {value: this.state.createur && (this.state.createur.prenom + ' ' + this.state.createur.nom), isEdit: false})}
                    {this.fieldFor('date_debut')}
                    {this.fieldFor('duree')}
                    {this.fieldFor('limite')}
                    {this.fieldFor('animateur',{options: {querySearcherCs: userServices.loadUserAutocomplete, initialString: this.props.event && this.props.event.animateur && this.props.event.animateur.nom + ' ' + this.props.event.animateur.prenom}})}
                    {this.state.coanimateurs && this.state.coanimateurs.length > 0 && this.state.coanimateurs.map( (coanim,index) => {
                        return <div data-focus='display-row'>{this.fieldFor('coanimateur'+index, {label: 'Co-Animateur '+index,options: {
                            FieldComponent: Autocomplete,
                            querySearcherCs: userServices.loadUserAutocomplete, 
                            initialString: coanim && coanim.nom + ' ' + coanim.prenom}})}
                                <Button type='button' icon='clear' label='Supprimer' handleOnClick={this.removeCoAnim(index)} />
                            </div>    
                    })}
                    <Button type='button' icon='add' label='Ajouter un co animateur' handleOnClick={this.addCoAnim} />

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
