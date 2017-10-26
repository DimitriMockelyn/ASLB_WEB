import React from 'react';
import homeServices from '../../services/home';
import PartenairePanel from './partenaire-panel';
export default React.createClass({
    displayName: 'PartenairesView',

    componentWillMount() {
        this.setState({});
        homeServices.loadPartenaires().then(res => {
            this.setState({partenaires: res});
        })
    },
    /** @inheritDoc */
    render() {
        return (
        <div>
            <label style={{'margin-left': '20px'}}>{i18n.t('partenaires.description')}</label>
            <div>
                {this.state && this.state.partenaires && this.state.partenaires.length > 0 && this.state.partenaires.map(value => {
                    return <PartenairePanel value={value} />
                })}
            </div>
        </div>
        );
    }
});
