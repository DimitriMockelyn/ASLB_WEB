import React from 'react';
import homeServices from '../../services/home';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import moment from 'moment';
import userHelper from 'focus-core/user';
import confirm from 'focus-core/application/confirm';

export default React.createClass({
    displayName: 'PartenairesView',

    componentWillMount() {
        this.setState({});
        homeServices.loadBlocs('espaces').then(res => {
            this.setState({blocs: res});
        })
    },
    /** @inheritDoc */
    render() {
        return (
        <div>
            <div>
                {this.state && this.state.blocs && this.state.blocs.length > 0 && this.state.blocs.map(value => {
                    return             <Panel title={value.titre}>
                        <div dangerouslySetInnerHTML={{ __html: value.contenu }} />
                    </Panel>
                })}
            </div>
        </div>
        );
    }
});
