//librairies
import React, {PropTypes} from 'react';
// web components
import {mixin as formPreset} from 'focus-components/common/form';
import history from 'focus-core/history';
//stores & actions
import {component as Label} from 'focus-components/common/label';
import {component as SearchBarHeader} from '../views/header/header-search-bar';
export default React.createClass({
    definitionPath:'da',
    mixins: [formPreset],
    stores: [],
    referenceNames: ['etatDAListe'],
    componentWillMount() {
        this.stores = this.props.store;
        this._registerListeners();
        if (this.props.action) {
            this.props.action(this.props.id);
        }
        this._buildReference();
    },
    componentWillReceiveProps(newProps) {
        if(newProps.store) {
            this.stores = newProps.store;
            this._registerListeners();
            if (newProps.action) {
                newProps.action(newProps.id);
            }
        }
    },
    getLabelFromCode(data,code) {
        for (const index in data) {
            if (data[index].code === +code) {
                return data[index].label;
            }
        }
        return '';
    },
    formatDa(value) {
        if (value) {
            return value.substring(0,2)+ ' '+value.substring(2,4)+ ' '+value.substring(4,9)+ ' '+value.substring(9,11);
        }
        return '';
    },
    getDefaultProps(){
        return {displayNumeroDA:false,displayEtatDA:false, displayAnneeExercice:false};
    },
    customValidation() {
        return false;
    },
    renderContent() {
        return <div data-focus='cartridge'>
            <SearchBarHeader/>
            <div data-focus="cartridge-content" data-type="form">
                {this.state.raisonSociale}
                {this.state.voiePhysique}
                {this.state.complementPhysique}
                <div>{this.state.codePostalPhysique} {this.state.communePhysique}</div>
                {this.props.displayNumeroDA && this.state.numeroDa && <div><Label name="cartridge.numeroDa" /> {this.formatDa(this.state.numeroDa)}</div>}
                <div>
                    <Label name="cartridge.numeroSiret" />
                    {(this.state.siren && this.state.numEtablissement) ? this.state.siren + '' + this.state.numEtablissement : this.state.siret}
                </div>
                {this.props.displayEtatDA &&
                <div>
                    <Label name="cartridge.etatDA" />
                    {this.getLabelFromCode(this.state.reference.etatDAListe,this.state.etatDAId)}
                </div>}
                {this.props.displayAnneeExercice && <div><Label name="cartridge.anneeExercice" /> {this.state.annee}</div>}
                {this.props.etatLastDA && <div><Label name="cartridge.etatLastDA" /> {this.state.etatLastDA}</div>}
            </div>
        </div>;
    }
});
