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
    definitionPath: 'typeEvenement',
    componentWillMount() {
    },
    getInitialState() {
        return {...this.props.data};
    },
    create() {
        if (this.validate()) {
            let data = this._getEntity();
            if (this.state._id) {
                adminServices.editTypeEvenement({ ...data, id: this.state._id}).then(this.props.onPopinClose);
            } else {
                adminServices.createTypeEvenement(data).then(this.props.onPopinClose);
            }
        }
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <Panel title='admin.typeEvenement'>
                {this.fieldFor('name', {isEdit: true})}
                {this.fieldFor('code', {isEdit: true})}
                {this.fieldFor('color', {isEdit: true})}
                {this.fieldFor('description', {isEdit: true})}
                {this.fieldFor('image', {isEdit: true})}
                {this.fieldFor('ordre', {isEdit: true})}
                <div>
                    <Button label='button.save' type='button' handleOnClick={this.create} />
                </div>
            </Panel>
        </div>
        );
    }
});
