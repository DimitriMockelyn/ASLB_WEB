import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import moment from 'moment';
import userHelper from 'focus-core/user';
import confirm from 'focus-core/application/confirm';

export default React.createClass({
    displayName: 'PartenairePanel',
    getInitialState() {
        return {}
    },
    render() {
        return (
        <div data-focus='panel-into-panel' className='person-tile'>
            <div data-focus='presentation-personne'  className={this.state.toggled === true ? 'toggled' : this.state.toggled === false ? 'closed' : ''}>
                <div data-focus='big-tile'>
                    <div data-focus='title' onClick={() => {this.setState({toggled: !this.state.toggled})}}>
                        <label>{this.props.value.name}</label>
                        <i className='material-icons'>{this.state.toggled ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
                    </div>
                    {this.props.value.image && <div className='image-line'><img src={this.props.value.image} alt={this.props.value.name}/></div>}
                    <div data-focus='presentation-box' className={this.state.toggled === true ? 'toggled' : this.state.toggled === false ? 'closed' : ''}>
                        <label>{i18n.t('contact.presentationTitre')}</label>
                        
                        <div data-focus='interview'>
                            <div dangerouslySetInnerHTML={{ __html: this.props.value.description }} />
                        </div>
                    </div>
                    <div data-focus='fonction'>
                        <label>{this.props.value.fonction}</label>
                    </div>
                </div>
            </div>     
        </div>
        );
    }
});
