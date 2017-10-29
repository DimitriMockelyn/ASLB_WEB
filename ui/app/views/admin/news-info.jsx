import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import adminServices from '../../services/admin';
import moment from 'moment';
import userHelper from 'focus-core/user';

export default React.createClass({
    displayName: 'HomeView',
    mixins: [formMixin],
    definitionPath: 'admin',
    componentWillMount() {
    },
    getInitialState() {
        return {...this.props.data};
    },
    create() {
        if (this.validate()) {
            let data = this._getEntity();
            if (this.state._id) {
                adminServices.editNews({ ...data, id: this.state._id}).then(this.props.onPopinClose);
            } else {
                adminServices.createNews(data).then(this.props.onPopinClose);
            }
        }
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <Panel title='admin.news'>
                {this.fieldFor('titre', {isEdit: true})}
                {this.fieldFor('content', {isEdit: true})}
                <div>
                    <Button label='admin.create' type='button' handleOnClick={this.create} />
                </div>
            </Panel>
        </div>
        );
    }
});
