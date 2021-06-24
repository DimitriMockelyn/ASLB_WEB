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
    mailToAnims()  {
        let newUrl = 'mailto:'+this.props.animateur.email;
        if (this.props.coanimateurs && this.props.coanimateurs.length > 0) {
            newUrl = newUrl+'?cc=';
            this.props.coanimateurs.map(anim => {
                newUrl = newUrl + anim.email + ';';
            })
        }
        window.location.href=newUrl;
    },
    /** @inheritDoc */
    renderContent() {
        console.log(this.state);
        var limitString = this.state.limite ?  '/' + this.state.limite : '';
        return (
            <div data-focus='event-consult-card'>
                <div className='top-row'>
                    <div className={this.computeCode(this.state.typeEvenement, 'typeEvenements')}>{this.computeLabel(this.state.typeEvenement, 'typeEvenements')}</div>
                    <div>{this.state.name}</div>
                    <div className='red'>{this.computeLabel(this.state.niveau, 'niveauEvenements')}</div>
                    <div>{translate('event.animePar')}</div>
                    <div>
                        <i style={{    'float': 'right', 'cursor': 'pointer'}} className='material-icons' onClick={this.mailToAnims}>mail</i>
                        {this.props.animateur && <div className='click-user-name'onClick={() => {setTimeout(() => {navigate('u/'+this.props.animateur._id, true)},10)}}>{this.props.animateur.prenom}</div>}
                        {this.props.coanimateurs && this.props.coanimateurs.length > 0 && this.props.coanimateurs.map(anim => {
                            return <div className='click-user-name'onClick={() => {setTimeout(() => {navigate('u/'+(anim ? anim._id : ''), true)},10)}}>{ anim && anim.prenom}</div>
                        })}
                    </div>
                </div>
                <div className='description'>
                    {this.state.description}
                </div>
                {this.state.tokenConsumer === false && <div className='line-info-not-consumer'>
                    <i className='material-icons'>info</i>
                    <div>{translate('event.doesNotConsumeToken')}</div>
                </div>}
                <div className='line-info'>
                    <div>{translate('event.dateHeure')}</div>
                    <div>{moment(this.state.startDate).format('DD/MM/YYYY      HH:mm')}</div>
                </div>
                <div className='line-info'>
                    <div>{translate('event.duree')}</div>
                    <div> {this.state.duree}</div>
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
                        if (!value) {
                            value = {}
                        }
                        return <div className='click-user-name' onClick={() => {setTimeout(() => {navigate('u/'+value._id, true)},10)}}>{value.nom + ' ' + value.prenom}<div>{this.props.computeSexeData(value)}</div></div>
                    })}
                </div>
                {this.state.fileAttente && this.state.fileAttente.length > 0 && <div>Liste d'attente</div>}
                {this.state.fileAttente && this.state.fileAttente.length > 0 && <div className='participants'>
                    {this.state.fileAttente.sort((a,b) => {return a.ordre - b.ordre;}).map(value => {
                        if (!value.personne) {
                            value.personne = {}
                        }
                        return <div className='click-user-name' onClick={() => {setTimeout(() => {navigate('u/'+value.personne._id, true)},10)}}>{value.personne.nom + ' ' + value.personne.prenom}<div>{this.props.computeSexeData(value.personne)}</div></div>
                    })}
                </div>}
            </div>
        );
    }
});
