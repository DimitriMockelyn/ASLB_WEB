import React from 'react';
import userServices from '../../services/user';
export default React.createClass({
    displayName: 'ActivationView',

    componentWillMount() {
        this.setState({});
        userServices.activate(this.props.id).then((res) => {
            this.setState({activated: res.activated});
        });
    },
    /** @inheritDoc */
    render() {
        return (
        <div>
            {this.state.activated === true && <div>{i18n.t('user.activated')}</div>}
            {this.state.activated === false && <div>{i18n.t('user.notActivated')}</div>}
        </div>
        );
    }
});
