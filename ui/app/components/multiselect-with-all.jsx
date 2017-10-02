//libraries
import React, {Component, PropTypes} from 'react';
import {remove} from 'lodash/array';
import {includes} from 'lodash/collection';
import Select from 'focus-components/components/input/select';
import Checkbox from 'focus-components/components/input/checkbox';

export default React.createClass({
    codeAll:'ALLSELECT',
    labelAll: 'multiselect.all',
    initialList: undefined,
    getInitialState() {
        if (this.props.codeAll !== undefined) {
            this.codeAll = this.props.codeAll;
        }
        const arrayValues = this.props.valuesList;
        if (this.props.allAtEnd) {
            arrayValues.push({code: this.codeAll, label: i18n.t(this.props.labelAll || this.labelAll)});
        } else {
            arrayValues.unshift({code: this.codeAll, label: i18n.t(this.props.labelAll || this.labelAll)});
        }
        this.initialList = arrayValues;
        const allCodes = [];
        for (let index = 0; index < arrayValues.length; index++) {
            allCodes.push(arrayValues[index].code);
        }
        let ids = [];
        if (this.props.allDefault) {
            ids = [this.codeAll];
        }
        if (this.props.value) {
            ids = this.props.value;
        }
      return {
          ids,
          allCodes,
          values: arrayValues,
          none: this.props.checkBoxNone ? true : false
      };
    },
    componentDidMount() {
        const select = this.refs.selected.refs.select.firstChild;
        const options = select && select.options;
        for (let i=0, iLen=options.length; i<iLen; i++) {
            const opt = options[i];

            if (opt.selected) {
                opt.scrollIntoView();
                window.scrollTo(0,0);
            }
        }
        if (this.props.afterMount) {
            this.props.afterMount(this);
        }
    },
    removeAllSelectCode(array) {
        const that = this;
        remove(array, function(obj) {
            return obj === that.codeAll;
        });
        return array;
    },
    getValue(){
        if (this.state.none && this.props.checkBoxNone) {
            return [];
        }
        let idSelected = this.state.ids;
        if (includes(idSelected, this.codeAll)) {
            idSelected = [];
            for(let index = 0; index < this.state.values.length; index++){
                idSelected.push(this.state.values[index].code);
            }
        }
        this.removeAllSelectCode(idSelected);
        return idSelected;
    },
    getSelectValues(select) {
        const result = [];
        const options = select && select.options;
        for (let i=0, iLen=options.length; i<iLen; i++) {
            const opt = options[i];

            if (opt.selected) {
                result.push(opt.value || opt.text);
            }
        }
        return result;
    },
    _handleSelectChange() {
        let ids = this.getSelectValues(this.refs.selected.refs.select.firstChild);
        if(this.props.toggleSelectOnAll && ids.length >= 2 && includes(ids, this.codeAll)){
            if(includes(this.state.ids, this.codeAll)){
                const index = ids.indexOf(this.codeAll);
                ids.splice(index, 1);
            } else {
                ids = [this.codeAll];
            }
        }
        this.setState({ids});
        if (this.props.onChange) {
            this.props.onChange(ids);
        }
    },
    toggleCheckBox() {
        this.setState({none: !this.state.none});
    },
    render() {
        return <div>
            {this.props.checkBoxNone && <Checkbox label='Aucune' value={this.state.none} onChange={this.toggleCheckBox} />}
            <Select
                ref='selected'
                disabled={this.state.none}
                multiple={true}
                hasUndefined={false}
                onChange={this._handleSelectChange}
                value={this.state.ids}
                values={this.state.values}/>
        </div>;
    }
});

