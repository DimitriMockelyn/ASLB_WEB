import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import adminServices from '../../../services/admin';
import moment from 'moment';
import userHelper from 'focus-core/user';

const typeBadgesList = [
    {
        value: 'requestBadgeEvenementCount',
        label: 'Nombre d\'événement quelconque',
        hasType: false,
        hasCount: true,
        hasAction: true
    },{
        value: 'requestBadgeEvenementTypeCount',
        label: 'Nombre d\'événement d\'un certain type',
        hasType: true,
        hasCount: true,
        hasAction: true
    },{
        value: 'requestBadgeEvenementAllTypeCount',
        label: 'Nombre d\'événement pour tous les types',
        hasType: false,
        hasCount: true,
        hasAction: true
    },{
        value: 'requestBadgeNoteEvenementsCount',
        label: 'Nombre d\'événement noté',
        hasType: false,
        hasCount: true,
        hasAction: false
    },{
        value: 'requestBadgeEvenementInMonthCount',
        label: 'Nombre d\'événement dans le mois',
        hasType: false,
        hasCount: true,
        hasAction: true
    },{
        value: 'requestBadgeAvatar',
        label: 'Entrer un avatar',
        hasType: false,
        hasCount: false,
        hasAction: false
    },{
        value: 'requestBadgeProfil',
        label: 'Saisir son profil',
        hasType: false,
        hasCount: false,
        hasAction: false
    }, {
        value: 'requestBadgeNoteTypeEvenementsCount',
        label: 'Nombre de notes sur un certain type d\'événement',
        hasType: true,
        hasCount: true,
        hasAction: false
    },{
        value: 'requestBadgeTypeEvenementInMonthCount',
        label: 'Nombre d\'événement d\'un certain type dans le mois',
        hasType: true,
        hasCount: true,
        hasAction: true
    }
];

export default React.createClass({
    displayName: 'HomeView',
    mixins: [formMixin],
    definitionPath: 'badges',
    referenceNames: ['typeEvenements'],
    componentWillMount() {
    },
    getInitialState() {
        if (this.props.data) {
            return {...this.props.data, ...this.deserializeRequest(this.props.data.requestCheck)};
        }
        return {}
    },
    deserializeRequest(request) {
        //Un evenement est une fonction, les deux premiers arguments sont badge et user
        //Ensuite on peut trouver le type d'evenement, puis le filtre utilisateur, et enfin la limite
        var obj = {}
        var fct = request.split('(');
        obj['typeDeBadge'] = fct[0];
        //On récupere les arguments
        var args = request.split(')')[0].split(',');
        //Le premiere et deuxieme, osef
        var reversed = args.reverse(); 
        reversed.pop();
        reversed.pop();
        if (reversed.length > 0) {
            obj['limitePourBadge'] = reversed[0].trim();
        }
        if (reversed.length > 1) {
            if (reversed[1].trim().startsWith('{')) {
                obj['action'] = reversed[1].trim();
            } else {
                obj['typeEvenement'] = reversed[1].trim().split('\'')[1];
            }
        }
        if (reversed.length > 2) {
            obj['typeEvenement'] = reversed[2].trim().split('\'')[1];
        }
        const typeBadge = typeBadgesList.find(val => val.value === obj['typeDeBadge']);
        if (typeBadge) {
            obj['hasType'] = typeBadge.hasType;
            obj['hasCount'] = typeBadge.hasCount;
            obj['hasAction'] = typeBadge.hasAction;
        }
        return obj;
    },
    computeRequest(data) {
        var res = data.typeDeBadge + '(badge, user';
        if (data.typeEvenement) {
            res = res + ',\''+data.typeEvenement+'\''
        }
        if (data.action) {
            res = res + ','+data.action+''
        }
        if (data.limitePourBadge) {
            res = res + ','+data.limitePourBadge+''
        }
        res = res + ')';
        return res;
    },
    create() {
        if (this.validate()) {
            let data = this._getEntity();
            if (!data._id) {
                data._id = undefined;
            }
            data.requestCheck = this.computeRequest(data);
            //On crée la méthode
            adminServices.saveBadges({ ...data, id: this.state._id}).then(this.props.onPopinClose);
        }
    },
    onChangeType(key) {
        const data = this._getEntity();
        const typeBadge = typeBadgesList.find(val => val.value === key);
        let metadata = {};
        if (typeBadge) {
            metadata['hasType'] = typeBadge.hasType;
            metadata['hasCount'] = typeBadge.hasCount;
            metadata['hasAction'] = typeBadge.hasAction;
        }
        this.setState({...data, typeDeBadge: key, ...metadata})
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <Panel title='Badges'>
                {this.fieldFor('titre', {isEdit: true})}
                {this.fieldFor('code', {isEdit: true, isRequired: true, valueKey: 'value', labelKey: 'label' , 
                    values: [{value: 'Bronze', label: 'Bronze'}, {value: 'Argent', label: 'Argent'}, {value: 'Or', label: 'Or'}, {value: 'Platinium', label: 'Platinium'}]})}
                {this.fieldFor('description', {isEdit: true})}
                {this.fieldFor('isMultiple', {isEdit: true})}
                {this.fieldFor('actif', {isEdit: true})}
                {this.fieldFor('typeDeBadge', {isEdit: true, isRequired: true, valueKey: 'value', labelKey: 'label' , 
                    values: typeBadgesList, onChange: this.onChangeType})}
                {this.state.hasCount && this.fieldFor('limitePourBadge', {isEdit: true, isRequired: true})}
                {this.state.hasType && this.fieldFor('typeEvenement', {isEdit: true, isRequired: true,listName: 'typeEvenements', valueKey: 'code', labelKey: 'name'})}
                {this.state.hasAction && this.fieldFor('action', {isEdit: true, isRequired: true, valueKey: 'value', labelKey: 'label' , 
                    values: [{
                        value: '{participants: user}',
                        label: 'Participant'
                    },{
                        value: '{animateur: user}',
                        label: 'Animateur'
                    },{
                        value: '{coanimateurs: user}',
                        label: 'Co-animateur'
                    }]})}
                <div>
                    <Button label='button.save' type='button' handleOnClick={this.create} />
                </div>
            </Panel>
        </div>
        );
    }
});
