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
    definitionPath: 'dayOff',
    componentWillMount() {
    },
    getInitialState() {
        return {...this.props.data};
    },
    create() {
        if (this.validate()) {
            let data = this._getEntity();
            if (this.state._id) {
                adminServices.editDayOff({ ...data, id: this.state._id}).then(this.props.onPopinClose);
            } else {
                adminServices.createDayOff(data).then(this.props.onPopinClose);
            }
        }
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <Panel title='admin.dayOff'>
                <div style={{height: '500px'}}>
                    {this.fieldFor('reason', {isEdit: true})}
                    {this.fieldFor('date', {isEdit: true})}
                    <div>
                        <Button label='button.save' type='button' handleOnClick={this.create} />
                    </div>
                </div>
            </Panel>
        </div>
        );
    }
});
