import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import React from 'react';
import { navigate, views } from 'react-big-calendar/lib/utils/constants';
import fetch from '../../../utils/fetch';
import {mixin as formMixin} from 'focus-components/common/form';
import builder from 'focus-core/util/url/builder';
import {component as Popin} from 'focus-components/application/popin';
import adminServices from '../../../services/admin';
import userHelper from 'focus-core/user';
import {component as Button} from 'focus-components/common/button/action';
import Toggle from 'focus-components/components/input/toggle';
import Panel from 'focus-components/components/panel';
import Input from 'focus-components/components/input/text';
import UserInfo from './user-info';
import UserRibbon from './user-ribbon';
import {downloadCSV} from '../../../utils/download';
import userServices from '../../../services/user';
import message from 'focus-core/message';

export default React.createClass({
    displayName: 'UsersView',
    mixins: [formMixin],
    definitionPath: 'person',
    referenceNames: ['typeSexe', 'typeEntreprise'],
    getInitialState() {
        return {
            limit: 5,
            filter: ''
        }
    },
    componentWillMount() {
        this.loadAllUsers();
    },
    loadAllUsers() {
        adminServices.loadAllUsers({filter: ''}).then(res => {this.setState({total: res.length})});
        adminServices.loadAllUsers({filter: this.state.filter}).then(res => {this.setState({users: res})});
    },
    export() {
        adminServices.exportAllUsers({filter: this.state.filter}).then(res => {downloadCSV(res, 'users.csv')});;
    },
    openPopin(user) {
        this.setState({selectedUser : user});
    },
    closePopin() {
        this.setState({selectedUser : undefined});
        this.loadAllUsers();
    },
    openPopinRibbon(user) {
        this.setState({selectedUserRibbon : user});
    },
    closePopinRibbon() {
        this.setState({selectedUserRibbon : undefined});
        this.loadAllUsers();
    },
    renderActionsEdit() {
        if (!this.props.hideButtons) {
            return <div>
                <Button type='button' label='button.createUser' handleOnClick={this.createUser} />
                <Button type='button' label='button.exporter' handleOnClick={this.export} />
                <Button type='button' label='button.voirPlus' handleOnClick={() => {this.setState({limit: this.state.limit+5})}}/>
            </div>
        }
    },
    createUser() {
        this.setState({createUser: true, canCreate: false, isAdmin: false, numero: ("000000" + (this.state.total+1)).slice(-6)});
    },
    closePopinCreate() {
        this.setState({
            createUser: false,
            email: undefined,
            prenom: undefined,
            nom: undefined,
            numero: undefined,
            dateNaissance: undefined,
            sexe: undefined,
            entreprise: undefined,
            telephone: undefined,
            date_activation: undefined,
            date_fin: undefined,
            dossier_complet: undefined,
            adhesion: undefined,
            decharge: undefined,
            reglement: undefined,
            certificat: undefined,
            cotisation: undefined,
            isAdmin: undefined,
            canCreate: undefined
        });
        this.loadAllUsers();
    },
    onChangeInput(value) {
        this.setState({filter: value}, this.loadAllUsers);
    },
    create() {
        if (this._validate()) {
            userServices.createFromAdmin(this._getEntity()).then(() => {
                this.closePopinCreate();
                message.addSuccessMessage(i18n.t('person.createdSuccess2'))
            }, err => { console.log(err); throw err;});
        }
    },
    computeDateFin(dateAdhesion) {
        var momentFin = moment('31/08/2018','DD/MM/YYYY');
        var momentLimit = moment('31/05/2017','DD/MM/YYYY');
        momentLimit.set('year', moment().get('year'));
        var momentDebut = moment(dateAdhesion, [moment.ISO_8601,'DD/MM/YYYY', 'DDMMYYYY']);
        if (momentDebut.isValid()) {
            momentFin.set('year', momentDebut.get('year'));
            if (momentFin.isBefore(momentDebut)) {
                momentFin.set('year', momentFin.get('year') +1);
            }
            if (momentDebut.isAfter(momentLimit)) {
                momentFin.set('year', momentFin.get('year') +1);
            }
            return  momentFin;
            //this.setState({date_fin: momentFin, date_activation: dateAdhesion});
        }
        
    },
    onChangeInfo(field) {
        let that = this;
        return (value) => {
            let data = that._getEntity();
            data[field] = value;
            if (data.adhesion && data.decharge && data.reglement && data.certificat && data.cotisation) {
                data.dossier_complet = true;
                data.date_activation = moment();
                data.date_fin = this.computeDateFin(moment());
            } else {
                data.dossier_complet = false;
                data.date_activation = undefined;
                data.date_fin = undefined;
            }
            that.setState(data);
        }
    },
    onChangeEmissionCertif(value) {
        var momentDebut = moment(value, [moment.ISO_8601,'DD/MM/YYYY', 'DDMMYYYY']);
        var momentFin = moment(value, [moment.ISO_8601,'DD/MM/YYYY', 'DDMMYYYY']);
        momentFin.set('year', momentFin.get('year')+3);
        this.setState({date_expiration_certificat: momentFin, date_emission_certificat: momentDebut});
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <Panel  title='Utilisateurs' actions={this.renderActionsEdit}>
            <Input placeholder='Tapez votre recherche' value={this.state.filter} onChange={this.onChangeInput} />
            <div data-focus='user-list'>
                <div data-focus='user-line'>
                    <div>
                        Nom
                    </div>
                    <div>E-mail</div>
                    <div>Numéro d'adhérent</div>
                    <div>Sexe</div>
                    <div>Entreprise</div>
                    <div>Date de début d'adhésion</div>
                    <div>Date de fin d'adhésion</div>
                    <div>Dossier complet</div>
                    <div>Adhésion</div>
                    <div>Décharge</div>
                    <div>Règlement</div>
                    <div>Certificat</div>
                    <div>Côtisation</div>
                    <div>Nombre d'inscriptions dans les 30 derniers jours</div>
                    <div>Nombre max de Jetons</div>
                    <div></div>
                </div>
                {this.state.users && this.state.users.length > 0 && this.state.users.map((value, pos) => {
                    if (pos < this.state.limit) {
                        return <div data-focus='user-line'>
                            <div>
                                <div>{value.nom + ' ' + value.prenom}</div>
                                {value.canCreate && <i className='material-icons' >border_color</i>}
                                {value.isAdmin && <i className='material-icons' >build</i>}
                            </div>
                            <div>{value.email}</div>
                            <div>{value.numero}</div>
                            <div>{value.sexe && value.sexe.label}</div>
                            <div>{value.entreprise && value.entreprise.label}</div>
                            <div>{value.date_activation && moment(value.date_activation, moment.ISO_8601).format('DD/MM/YYYY')}</div>
                            <div>{value.date_fin && moment(value.date_fin, moment.ISO_8601).format('DD/MM/YYYY')}</div>
                            <div>{value.dossier_complet}</div>
                            <div>{value.adhesion}</div>
                            <div>{value.decharge}</div>
                            <div>{value.reglement}</div>
                            <div>{value.certificat}</div>
                            <div>{value.cotisation}</div>
                            <div>{value.nombreInscription}</div>
                            <div>{value.tokens}</div>
                            <div><Button type='button' icon='edit' shape='fav' handleOnClick={() => {this.openPopin(value)}}/>
                            <Button type='button' icon='fitness_center' shape='fav' handleOnClick={() => {this.openPopinRibbon(value)}}/></div>
                        </div>
                    }
                })}
            </div>
            {this.state.selectedUser && <Popin open={true} size='medium' onPopinClose={this.closePopin}>
                <UserInfo hasLoad={false} data={this.state.selectedUser} onPopinClose={this.closePopin}/>
            </Popin>}
            {this.state.selectedUserRibbon && <Popin open={true} size='medium' onPopinClose={this.closePopinRibbon}>
                <UserRibbon hasLoad={false} data={this.state.selectedUserRibbon} onPopinClose={this.closePopinRibbon}/>
            </Popin>}
            {this.state.createUser && <Popin open={true} size='medium' onPopinClose={this.closePopinCreate}>
                {this.fieldFor('email', {isEdit: true})}
                {this.fieldFor('prenom', {isEdit: true})}
                {this.fieldFor('nom', {isEdit: true})}
                {this.fieldFor('numero', {isEdit: true})}
                {this.fieldFor('dateNaissance', {isEdit: true})}
                {this.fieldFor('sexe', {isEdit: true, listName: 'typeSexe', valueKey: '_id', isRequired: true})}
                {this.fieldFor('entreprise', {isEdit: true, listName: 'typeEntreprise', valueKey: '_id', isRequired: true})}
                {this.fieldFor('telephone', {isEdit: true})}
                {this.fieldFor('date_activation', {isEdit: false})}
                {this.fieldFor('date_fin', {isEdit: false})}
                {this.fieldFor('dossier_complet', {isEdit: false})}
                {this.fieldFor('adhesion', {isEdit: true, onChange: this.onChangeInfo('adhesion')})}
                {this.fieldFor('decharge', {isEdit: true, onChange: this.onChangeInfo('decharge')})}
                {this.fieldFor('reglement', {isEdit: true, onChange: this.onChangeInfo('reglement')})}
                {this.fieldFor('certificat', {isEdit: true, onChange: this.onChangeInfo('certificat')})}
                {this.fieldFor('date_emission_certificat', {isEdit: true, onChange: this.onChangeEmissionCertif})}
                <div style={{'display':'none'}}>
                    {this.fieldFor('date_expiration_certificat', {isEdit: false})}
                </div>
                {this.fieldFor('cotisation', {isEdit: true, onChange: this.onChangeInfo('cotisation')})}
                {this.fieldFor('isAdmin', {isEdit: true})}
                {this.fieldFor('canCreate', {isEdit: true})}
                <Button label='user.creation' type='button' handleOnClick={this.create} />
            </Popin>}
        </Panel>
        );
    }
});
