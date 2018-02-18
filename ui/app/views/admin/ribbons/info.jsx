import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import adminServices from '../../../services/admin';
import moment from 'moment';
import userHelper from 'focus-core/user';
import Ribbon from '../../../components/ribbon';
export default React.createClass({
    displayName: 'HomeView',
    mixins: [formMixin],
    definitionPath: 'ribbon',
    componentWillMount() {
    },
    getInitialState() {
        return {
            text: '',
            color_ribbon : 'rgba(0,138,59,1)',
            color_ribbon_light : 'rgba(0,114,45,1)',
            color_ribbon_dark : 'rgba(0,86,28,1)',
            color_ribbon_darker : 'rgba(15,51,10,1)',
            ...this.props.data};
    },
    create() {
        if (this.validate()) {
            let data = this._getEntity();
            if (this.state._id) {
                adminServices.editRibbon({ ...data, id: this.state._id}).then(this.props.onPopinClose);
            } else {
                adminServices.createRibbon(data).then(this.props.onPopinClose);
            }
        }
    },
    onChangeRibbon(field) {
        return (value) => {
            let data = this._getEntity();
            data[field] = value;
            this.setState(data);
        }
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <Panel title='admin.ribbons'>
            
            {this.fieldFor('text', {isEdit: true, onChange: this.onChangeRibbon('text')})}
            <div className='color-line'>
            {this.fieldFor('color_ribbon', {isEdit: true, hasLabel: false, contentSize: 12, onChange: this.onChangeRibbon('color_ribbon')})}            
            {this.fieldFor('color_ribbon_light', {isEdit: true,  hasLabel: false, contentSize: 12, onChange: this.onChangeRibbon('color_ribbon_light')})}            
            {this.fieldFor('color_ribbon_dark', {isEdit: true,  hasLabel: false, contentSize: 12, onChange: this.onChangeRibbon('color_ribbon_dark')})}            
            {this.fieldFor('color_ribbon_darker', {isEdit: true, hasLabel: false, contentSize: 12, onChange: this.onChangeRibbon('color_ribbon_darker')})}            
            </div>
            <Ribbon {...this.state} />
            <div>
                    <Button label='button.save' type='button' handleOnClick={this.create} />
                </div>  
            </Panel>
        </div>
        );
    }
});
