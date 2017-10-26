import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import moment from 'moment';
import userHelper from 'focus-core/user';
import confirm from 'focus-core/application/confirm';

export default React.createClass({
    displayName: 'PartenairePanel',
    /** @inheritDoc */
    gotoUrl() {
        if (this.props.value.url) {
            window.open(this.props.value.url,'_blank');
        }
    },
    render() {
        return (
        <div className={this.props.value.url ? 'clickable' : ''} data-focus='panel-partenaire'>
            <Panel title={this.props.value.name} onClick={this.gotoUrl}>
                {this.props.value.logo && <img src={this.props.value.logo} alt={this.props.value.name}/>}
                <div dangerouslySetInnerHTML={{ __html: this.props.value.description }} />
            </Panel>
        </div>
        );
    }
});
