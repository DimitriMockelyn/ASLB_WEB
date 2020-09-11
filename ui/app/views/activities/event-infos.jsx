import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import activiteServices from '../../services/activite';
import moment from 'moment';
import userHelper from 'focus-core/user';
import confirm from 'focus-core/application/confirm';
import userServices from '../../services/user';
import message from 'focus-core/message';
import EventCard from './event-card';
import {translate} from 'focus-core/translation';
import Autocomplete from '../../components/autocomplete-field';
import {download} from '../../utils/download';
import Absents from '../historique/absents';
import {component as Popin} from 'focus-components/application/popin';
const ConfirmPopup = React.createClass({
    render() {
        return <div data-focus='display-column' className={(this.props.tokensRestant === 0 && this.props.isNotFree) ? 'no-actions' : ''}>
                {this.props.tokensRestant !== 0 && translate('agenda.messageQueue').split('\n').map(data => {
                    return <label>{data}</label>
                })}
                {(this.props.tokensRestant === 0 || !this.props.isNotFree) && translate('agenda.messageQueueImpossible').split('\n').map(data => {
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
    checkDoubleSave: false,
    componentWillMount() {
        this.setState({});

    },
    componentWillReceiveProps() {
        this.setState({updated: !this.state.updated});
    },
    getInitialState() {
        let complement = {};
        return {...this.props.event, ...complement,
            date_debut : moment(this.props.event.date_debut)
        };
    },
    isPasse() {
        return moment(this.props.event.date_debut).isBefore(moment());
    },
    addSelf() {
        if (!this.checkDoubleSave) {
            this.checkDoubleSave = true
            if (this.validate()) {
                this.checkDoubleSave = false;
                if (this.props.event.participants.length === this.props.event.limite) {
                    confirm(() => { return <ConfirmPopup isNotFree={this.props.event.tokenConsumer} tokensRestant={this.props.tokensRestant}  />}, {cancelButtonLabel: 'button.cancelQueue', confirmButtonLabel: 'button.acceptQueue'}).then(this.trueAddSelf);
                } else { 
                    this.trueAddSelf();
                }
            }
        }
    },
    trueAddSelf() {
        activiteServices.addSelfToEvent(this.props.event).then( res => {
            if (res.message) {
                message.addSuccessMessage(res.message);
            }
            this.props.onPopinClose();
        });
    },
    removeSelf() {
        if (this.validate()) {
            activiteServices.removeSelfToEvent(this.props.event).then(this.props.onPopinClose);
        }
    },
    deleteEvent() {
        confirm(i18n.t('event.deleteEventConfirm')).then(() => activiteServices.deleteEvent(this.props.event).then(this.props.onPopinClose));
            //request.execute(function(event) {that.props.onPopinClose()})
    },
    isInEvent(id) {
        debugger;
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
    isOwner() {
        return userHelper.getLogin() && this.props.event.createur._id === userHelper.getLogin()._id;
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
        activiteServices.updateEvent(entity).then((res) => {
            this.props.onPopinClose({reopen: this.props.event._id});
        })
    },
    renderActionsUpdate() {
        var buttonClone = <div/>;
        if (!this.state.isEdit && this.props.onClone) {
            buttonClone = <Button label='button.clone' type='button' handleOnClick={() => {this.props.onClone(this.props.event)}} />
        }

        var buttonMail = <div/>
        if (this.isPasse()) {

            return <div>{buttonMail} {buttonClone}</div>;
        }

        var buttonEdit = <div/>;
        if (this.state.isEdit) {
            buttonEdit = <Button label='button.save' type='button' handleOnClick={this.update} />
        }
        if (this.isOwner() || (userHelper.getLogin() && userHelper.getLogin().isAdmin) ) {
            if (this.state.isEdit) {
                buttonEdit = <Button label='button.save' type='button' handleOnClick={this.update} />
            } else {
                buttonEdit = <Button label='button.edit' type='button' handleOnClick={ () => this.setState({isEdit: !this.state.isEdit})} />;
            }  
        }
        var buttonMail = <div/>
        if (this.state.isEdit || (userHelper.getLogin() && userHelper.getLogin().isAdmin)) {
            buttonMail = <Button label='button.sendMailParticipants' icon='mail' type='button' handleOnClick={this.sendMailParticipants} />;
        }
        var buttonInvite = <div />;
        if (userHelper.getLogin() && (this.isInEvent(userHelper.getLogin()._id))) {
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
        return <div data-focus='display-row'> {buttonInvite} {buttonMailAppoint} {buttonEdit} {buttonMail} {buttonClone}</div>
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
            <Panel title='agenda.activityDetail' actions={this.renderActionsUpdate} >
                {!this.state.isEdit && <EventCard hasForm={false} hasLoad={false} data={this.state} computeSexeData={this.computeSexeData} animateur={this.state.animateurUpdate || this.props.event.animateur} coanimateurs={this.state.coanimateursUpdate || this.props.event.coanimateurs}/>}
                {this.state.isEdit && <div>
                    {this.fieldFor('title', {isEdit: true})}
                {this.fieldFor('limite', {isEdit: true})}            
                {this.fieldFor('description', {isEdit: true})}
                    {this.state.participants && this.state.participants.length > 0 && <div data-focus='participants-list'>
                        <label>{i18n.t('event.participantsList') + ' ('+this.state.participants.length+')'}</label>
                        <div data-focus='list'>
                            {this.state.participants && this.state.participants.length > 0 && this.state.participants.map(value => {
                                return <div>{value.nom + ' ' + value.prenom}<div>{this.computeSexeData(value)}</div></div>
                            })}
                        </div>
                    </div>}
                </div>}
                
                
                {userHelper.getLogin() && !this.isInEvent(userHelper.getLogin()._id) && !this.isPasse() &&  <div>
                    <Button label='event.addSelf' type='button' handleOnClick={this.addSelf} />
                </div>}

                {userHelper.getLogin() && this.isInEvent(userHelper.getLogin()._id) && !this.isPasse() && <div>
                    <Button label='event.removeSelf' type='button' handleOnClick={this.removeSelf} />
                </div>}
                {(this.isOwner() || (userHelper.getLogin() && userHelper.getLogin().isAdmin)) && !this.isPasse() && <div>
                    <Button label='event.deleteEvent' type='button' handleOnClick={this.deleteEvent} />
                </div>}
            </Panel>
        </div>
        );
    }
});
