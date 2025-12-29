import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import moment from 'moment';
import userHelper from 'focus-core/user';
import confirm from 'focus-core/application/confirm';
import {component as Popin} from 'focus-components/application/popin';
import Absents from './absents';
export default React.createClass({
    displayName: 'NewsPanel',
    noteMoyenne : 0.0,
    nbNote: 0,
    nbCommentaires: 0,
    computeNote() {
        this.noteMoyenne = 0.0;
        this.nbNote = 0;
        this.nbCommentaires = 0;
        if (this.props.data.commentaires) {
            for (let index in this.props.data.commentaires) {
                let comm = this.props.data.commentaires[index];
                if (comm.note) {
                    this.noteMoyenne = (this.noteMoyenne*this.nbNote+comm.note)/(this.nbNote+1);
                    this.nbNote = this.nbNote +1;
                }
                if (comm.commentaire) {
                    this.nbCommentaires++;
                }
            }
        }
    },
    getInitialState() {
        return {}
    },
    componentWillMount() {
        this.computeNote();
    },
    toggleGestionAbsent() {
        this.setState({togglePopinAbsent : true});
    },
    closePopin() {
        this.setState({togglePopinAbsent : false});
    },
    renderAction() {
        return <Button label='Gérer les absents' type='button' shape='' handleOnClick={this.toggleGestionAbsent} />;
    },
    /** @inheritDoc */
    render() {
        var limitString = this.props.data.limite ?  '/' + this.props.data.limite : '';
        return (
        <div data-focus='panel-into-panel'>
            <Panel title={(this.props.data.typeEvenement ? this.props.data.typeEvenement.name : '') + ' - ' + this.props.data.name} actions={this.renderAction}>
            <div onClick={this.props.onClick}>
                <div>
                    {this.props.data.description}
                </div>
                {this.nbNote !== 0 && <div>
                    {i18n.t('event.noteMoyenne') + ' ' + this.noteMoyenne + '/5 ( ' + this.nbNote + ' note(s) )' }
                    </div>}
                {!this.nbNote && <div>{i18n.t('event.noNotes')}</div>}
                {<div>
                    {this.nbCommentaires + ' commentaire(s)'}    
                </div>}
                <div data-focus='news-info'>
                    <div>{i18n.t('admin.eventAt') + ' ' + moment(this.props.data.date_debut, moment.ISO_8601).format('DD/MM/YYYY - HH:mm') + ' - ' +
                     i18n.t('event.duree') + ' ' + this.props.data.duree + ' - ' +
                     i18n.t('admin.nbInscrits') + ' ' + this.props.data.participants.length + limitString} </div>
                </div>
            </div>
            {this.state.togglePopinAbsent && <Popin open={true} type='from-right' onPopinClose={this.closePopin}>
                <Absents id={this.props.data._id} />
            </Popin>}
            
            </Panel>
        </div>
        );
    }
});
