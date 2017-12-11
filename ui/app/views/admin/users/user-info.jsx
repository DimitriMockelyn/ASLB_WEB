import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import adminServices from '../../../services/admin';
import moment from 'moment';
import userHelper from 'focus-core/user';

export default React.createClass({
    displayName: 'HomeView',
    mixins: [formMixin],
    definitionPath: 'person',
    componentWillMount() {
    },
    getInitialState() {
        return {...this.props.data};
    },
    canCreateToggle() {
        adminServices.canCreateToggle({ id: this.state._id}).then(this.props.onPopinClose);
    },
    toggleAdmin() {
        adminServices.toggleAdmin({ id: this.state._id}).then(this.props.onPopinClose);
    },
    update() {
        adminServices.updateUser({...this._getEntity(),id: this.state._id, avatar: undefined}).then(this.props.onPopinClose);
        this.setState({...this._getEntity(),isEdit: !this.state.isEdit});
    },
    renderActionsUpdate() {
        if (this.state.isEdit) {
            return <Button label='button.save' type='button' handleOnClick={this.update} />
        } else {
            return <Button label='button.edit' type='button' handleOnClick={ () => this.setState({isEdit: !this.state.isEdit})} />;
        }
    },
    computeDateFin(dateAdhesion) {
        console.log(dateAdhesion);
        var momentFin = moment('31/08/2018','DD/MM/YYYY');
        var momentDebut = moment(dateAdhesion, moment.ISO_8601);
        momentFin.set('year', momentDebut.get('year'));
        if (momentFin.isBefore(momentDebut)) {
            momentFin.set('year', momentFin.get('year') +1);
        }
        if (momentFin.get('year') === 2018) {
            momentFin.set('year', momentFin.get('year') +1);
        }
        this.setState({date_fin: momentFin, date_activation: momentDebut});
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <Panel title='admin.personDetail' actions={this.renderActionsUpdate}>
                {this.fieldFor('nom', {isEdit: false})}
                {this.fieldFor('prenom', {isEdit: false})}
                {this.fieldFor('email', {isEdit: false})}
                {this.fieldFor('date_activation', {onChange: this.computeDateFin})}
                {this.fieldFor('date_fin')}
                {this.fieldFor('dossier_complet')}
                {this.fieldFor('canCreate', {isEdit: false})}
                {this.fieldFor('isAdmin', {isEdit: false})}
                <div>  
                    <Button label='person.toggleCanCreate' type='button' handleOnClick={this.canCreateToggle} />
                    <Button label='person.setAdmin' type='button' handleOnClick={this.toggleAdmin} />
                </div>
            </Panel>
        </div>
        );
    }
});
