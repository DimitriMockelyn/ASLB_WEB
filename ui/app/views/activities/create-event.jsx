import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import adminServices from '../../services/admin';
import moment from 'moment';
import userHelper from 'focus-core/user';
import userServices from '../../services/user';
import Autocomplete from '../../components/autocomplete-field';

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
            this.props.createEvent(entity).then(this.props.onPopinClose);
            //request.execute(function(event) {that.props.onPopinClose()})
        }
    },
    toggleLock() {
        this.props.toggleLock(!this.state.locked);
    },
    renderCstAct() {
        return                 (<div>
        <Button label='activity.create' type='button' handleOnClick={this.create} />
        {userHelper.getLogin() && userHelper.getLogin().isAdmin && <Button label={'activity.'+(this.state.locked ? 'un' : '')+'lock'} type='button' handleOnClick={this.toggleLock} />}
        </div>);
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <Panel title='agenda.activityDetail' actions={this.renderCstAct}>
                {this.fieldFor('title', {isEdit: !this.state.locked})}
                {this.fieldFor('limite', {isEdit: !this.state.locked})}            
                {this.fieldFor('description', {isEdit: !this.state.locked})}
            </Panel>
        </div>
        );
    }
});
