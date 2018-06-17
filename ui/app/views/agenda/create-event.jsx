import React from 'react';
import Calendar from './calendar';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import agendaServices from '../../services/agenda';
import moment from 'moment';
import userHelper from 'focus-core/user';
import userServices from '../../services/user';
import Autocomplete from '../../components/autocomplete-field';

export default React.createClass({
    displayName: 'HomeView',
    mixins: [formMixin],
    definitionPath: 'event',
    referenceNames: ['typeEvenements', 'niveauEvenements'],
    componentWillMount() {
    },
    getInitialState() {
        return {...this.props.data, date_debut : moment(this.props.data.start), coanimateurs: []};
    },
    create() {
        if (this.validate()) {
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
            agendaServices.createEvent(entity).then(this.props.onPopinClose);
            //request.execute(function(event) {that.props.onPopinClose()})
        }
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
    renderCstAct() {
        return                 (<div>
        <Button label='event.create' type='button' handleOnClick={this.create} />
        </div>);
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <Panel title='agenda.evenementDetail' actions={this.renderCstAct}>
                {this.fieldFor('name', {isEdit: true})}
                {this.fieldFor('date_debut', {isEdit: true})}
                {this.fieldFor('duree', {isEdit: true})}
                {this.fieldFor('limite', {isEdit: true})}
                {this.fieldFor('animateur', {isEdit: true, options: {querySearcherCs: userServices.loadUserAutocomplete}})}
                {this.state.coanimateurs && this.state.coanimateurs.length > 0 && this.state.coanimateurs.map( (coanim,index) => {
                        return <div data-focus='display-row'>{this.fieldFor('coanimateur'+index, {isEdit: true, label: 'Co-Animateur '+index,options: {
                            FieldComponent: Autocomplete,
                            querySearcherCs: userServices.loadUserAutocomplete, 
                            initialString: coanim && coanim.nom + ' ' + coanim.prenom}})}
                                <Button type='button' icon='clear' label='Supprimer' handleOnClick={this.removeCoAnim(index)} />
                            </div>    
                    })}
                    <Button type='button' icon='add' label='Ajouter un co animateur' handleOnClick={this.addCoAnim} />
                {this.fieldFor('description', {isEdit: true})}
                {this.fieldFor('typeEvenement', {isEdit: true, listName: 'typeEvenements', isRequired: true, valueKey: '_id', labelKey: 'name'})}
                {this.fieldFor('niveau', {isEdit: true, listName: 'niveauEvenements', valueKey: '_id', labelKey: 'name'})}
            </Panel>
        </div>
        );
    }
});
