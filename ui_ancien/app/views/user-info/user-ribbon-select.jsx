import React from 'react';
import Panel from 'focus-components/components/panel';
import {mixin as formMixin} from 'focus-components/common/form';
import {component as Button} from 'focus-components/common/button/action';
import adminServices from '../../services/admin';
import moment from 'moment';
import userHelper from 'focus-core/user';
import confirm from 'focus-core/application/confirm';
import Textarea from 'focus-components/components/input/textarea';
import {translate} from 'focus-core/translation';
import Ribbon from '../../components/ribbon';

export default React.createClass({
    displayName: 'HomeView',
    mixins: [formMixin],
    definitionPath: 'person',
    componentWillMount() {
        adminServices.loadAllRibbons().then(res => {this.setState({ribbons: res})});
        adminServices.loadUserRibbons(this.props.data._id).then(res => {this.setState({ribbonsOwned: res.ribbonDisponible})});
    },
    isOwned(data) {
        if (this.state.ribbonsOwned) {
            for (let index in this.state.ribbonsOwned) {
                if (data._id.toString() === this.state.ribbonsOwned[index].toString()) {
                    return true;
                }
            }
        }
        return false;
    },
    toggleRibbon(rib) {
        return () => {
            adminServices.toggleActiveRibbon({usrId: this.props.data._id, ribId: rib._id}).then(() => {
                this.props.onPopinClose();
            });
        }
    },
    /** @inheritDoc */
    renderContent() {
        return (
        <div>
            <label>Selectionnez un ruban pour l'activer</label>
            <div data-focus='display-row'>
            <div onClick={this.toggleRibbon({_id: 'none'})} className={'to-select'}>
                    <Ribbon text='Aucun' isNone={true} color_ribbon='' color_ribbon_light='' color_ribbon_dark='' color_ribbon_darker='' />
                </div>
            {this.state.ribbons && this.state.ribbons.map(rib => {
                const isOwned = this.isOwned(rib);
                if (isOwned) {
                return <div onClick={this.toggleRibbon(rib)} className={'to-select'}>
                    <Ribbon {...rib} />
                </div>
                }
            })}
            </div>
        </div>
        );
    }
});
