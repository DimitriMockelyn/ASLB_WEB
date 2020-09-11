import React from 'react';
import moment from 'moment';
import {translate} from 'focus-core/translation';
import {mixin as formMixin} from 'focus-components/common/form';
import {navigate} from 'focus-core/history';

export default React.createClass({
    displayName: 'TileView',
    mixins: [formMixin],
    definitionPath: 'event',
    referenceNames: ['typeEvenements', 'niveauEvenements', 'typeSexe'],
    componentWillMount() {
        this.setState(this.props.data);
    },
    getInitialState() {
        return {}
    },
    computeLabel(id, listName) {
        if (!id || !this.state.reference || !this.state.reference[listName]) {
            return '';
        }

        return (this.state.reference[listName].find(data => { return data._id === id}) || {name: ''}).name;
    },
    computeCode(id, listName) {
        if (!id || !this.state.reference || !this.state.reference[listName]) {
            return '';
        }

        return (this.state.reference[listName].find(data => { return data._id === id}) || {code: ''}).code;
    },
    /** @inheritDoc */
    renderContent() {
        console.log(this.state);
        var limitString = this.state.limite ?  '/' + this.state.limite : '';
        return (
            <div data-focus='event-consult-card'>
                <div className='top-row'>
                    <div>{this.state.title}</div>
                    
                </div>
                <div className='description'>
                    {this.state.description}
                </div>
                
                <div className='line-info mrg-top'>
                    <div>{translate('event.participantsPlace')}</div>
                    <div>{this.state.participants.length+limitString}</div>
                </div>
                <div className='line-info'>
                    <div>{translate('event.participantsList')}</div>
                </div>
                <div className='participants'>
                    {this.state.participants && this.state.participants.length > 0 && this.state.participants.map(value => {
                        return <div className='click-user-name' onClick={() => {setTimeout(() => {navigate('u/'+value._id, true)},10)}}>{value.nom + ' ' + value.prenom}<div>{this.props.computeSexeData(value)}</div></div>
                    })}
                </div>
            </div>
        );
    }
});
