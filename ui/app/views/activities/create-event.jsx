import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import adminServices from '../../services/admin';
import moment from 'moment';
import userHelper from 'focus-core/user';
import userServices from '../../services/user';
import Autocomplete from '../../components/autocomplete-field';
import message from 'focus-core/message';
export default React.createClass({
    displayName: 'HomeView',
    mixins: [formMixin],
    definitionPath: 'event',
    componentWillMount() {
    },
    getInitialState() {
        return {...this.props.data};
    },
    create() {
        if (this.validate()) {
            let entity = this._getEntity();
            if (entity.participants && entity.participants.length > 0) {
                let newArray = [];
                entity.participants.map((anim, index) => {
                    if (entity['participant'+index]) {
                        newArray.push(entity['participant'+index]);
                    }
                });
                entity.participants = newArray;
            } else {
                entity.participants = [];
            }
            if (entity.limite < entity.participants.length) {
                message.addErrorMessage("Vous ne pouvez pas reduire le nombre de participants a ce niveau.");
                return;
            }
            this.props.createEvent(entity).then(this.props.onPopinClose);
            //request.execute(function(event) {that.props.onPopinClose()})
        }
    },
    toggleLock() {
        this.props.toggleLock(!this.state.locked);
    },
    renderCstAct() {
        return                 (<div>
        {!this.state.locked && <Button label='activity.create' type='button' handleOnClick={this.create} />}
        {userHelper.getLogin() && userHelper.getLogin().isAdmin && <Button label={'activity.'+(this.state.locked ? 'un' : '')+'lock'} type='button' handleOnClick={this.toggleLock} />}
        </div>);
    },
    addParticipant() {
        let state = this.state;
        let entity = this._getEntity();
        state.participants.map((data,index) => {
            state.participants[index] = entity['participant'+index];
        })
        state.participants.push(undefined);
        state.limite = entity.limite;
        this.setState(state);
    },
    removeParticipant(index) {
        let that = this;
        return () => {
            let state = that.state;
            let entity = this._getEntity();
            state.limite = entity.limite;
            state.participants.map((data,index2) => {
                let initStr = that.refs['event.participant'+index2].refs.input.refs.autocompleteComponent.refs.autocomplete.state.inputValue;
                if (!entity['participant'+index2] || entity['participant'+index2]._id) {
                    state.participants[index2] = entity['participant'+index2];
                } else {
                    state.participants[index2] = {_id :entity['participant'+index2], nom: initStr, prenom: ''};
                }
            })
            for (let index2 in that.state.participants) {
                state['participant'+index2] = undefined;
            }
            
            state.participants.splice(index, 1);
            let complement = {};
            state.participants.map((data,index2) => {
                complement['participant'+index2] = data ? data._id : undefined;
            })
            that.setState({...state, ...complement});
        }
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <Panel title='agenda.activityDetail' actions={this.renderCstAct}>
                {this.fieldFor('title', {isEdit: !this.state.locked})}
                {this.fieldFor('limite', {isEdit: !this.state.locked})}            
                {this.fieldFor('description', {isEdit: !this.state.locked})}
                {this.state.participants && this.state.participants.length > 0 && this.state.participants.map( (coanim,index) => {
                        return <div data-focus='display-row'>{this.fieldFor('participant'+index, {isEdit: true, label: 'Participant '+(index+1),options: {
                            FieldComponent: Autocomplete,
                            querySearcherCs: userServices.loadActiveUserAutocomplete, 
                            initialString: coanim && coanim.nom + ' ' + coanim.prenom}})}
                                <Button type='button' icon='clear' label='Supprimer' handleOnClick={this.removeParticipant(index)} />
                            </div>    
                    })}
                    {!this.state.locked && <Button type='button' icon='add' label='Ajouter un participant' handleOnClick={this.addParticipant} />}
            </Panel>
        </div>
        );
    }
});
