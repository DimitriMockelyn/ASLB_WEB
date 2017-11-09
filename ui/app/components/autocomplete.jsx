//libraries
import React, {Component, PropTypes} from 'react';

import {AutocompleteSelect} from 'focus-components/components/input';
import {isUndefined, isNull, isNaN, isNumber} from 'lodash/lang';

export default React.createClass({
    queryResult: undefined,
    initialized : false,
    wasConsult: true,
    hasPropsInitialString(newProps) {
        return newProps && newProps.options && newProps.options.initialString;
    },
    shouldReinit(newProps) {
      return !this.initialized || (this.wasConsult === true && newProps.isEdit === true);
    },
    componentWillReceiveProps(newProps) {
        if (this.hasPropsInitialString(newProps) && newProps.value && this.shouldReinit(newProps)) {
            if (!this.initialized) {
                this.initialized = true;
            }
            this.querySearcher(newProps.options.initialString).then(() => {
                this.setState({value: newProps.value});
            });

        }
        this.wasConsult = !newProps.isEdit;

    },
    getLabelFromKey(key) {
        if (this.queryResult !== undefined) {
            for (const index in this.queryResult.data) {
                if (this.queryResult.data[index].key.toString() === key.toString()) {
                    return this.queryResult.data[index].label;
                }
            }
        }
        return this.props.options && this.props.options.initialString ? this.props.options.initialString : '';
    },
    keyResolver(key){
        return new Promise(resolve => {
            // mapping entre key et label ?            
            setTimeout(resolve.bind(this, this.getLabelFromKey(key)), 1);
        });
    },
    getValue() {
        if (this.state.value) {
            return this.state.value;
        }
        return undefined;
    },
    getInitialState(){
        return {value : this.props.value};
    },
    querySearcher(query) {
        const that = this;
        if (query.length > 0) {
            return this.props.options.querySearcherCs ?
                this.props.options.querySearcherCs({data: {criteria: query}, urlData: {skip: 0, top: 30}}).then(res=> {
                    
                    that.queryResult = res;
                    return res;
                }) :
                this.props.options.querySearcher({data: {criteria: query}, urlData: {skip: 0, top: 30}}).then(res=> {
                    that.queryResult = res;
                    return res;
                });
        }
    },
    onChange(key) {
        
        this.state.customError = null;
        this.state.value = key;
        if (this.props.onChange) {
            this.props.onChange(key);
        }
    },
    handleCustomBadInputvalue(value) {
        this.setState({customError: this.props.options.handleBadInputMessage(value)});
    },
    componentDidMount() {
        if (this.props.options.handleBadInputMessage) {
            this.refs.autocompleteComponent._handleAutocompleteBadInput = this.handleCustomBadInputvalue;
        }
    },
    validate() {
        const value = this.getValue();
        const isRequired = this.props.isRequired;
        if (value === null || value === undefined) {
            this.props.options.handleBadInputMessage && this.setState({customError: this.props.options.handleBadInputMessage(value)});
            if (isRequired) {
                this.setState({customError: i18n.t('field.required')});
            }
            return {
                isValid: !isRequired,
                message: 'field.required'
            };
        } else {
            this.setState({customError: undefined});
            return {
                isValid: true,
                message: ''
            };
        }
    },
    render() {
        return <div>
            <AutocompleteSelect
                ref='autocompleteComponent'
                isEdit={this.props.isEdit}
                keyResolver={this.keyResolver}
                querySearcher={this.querySearcher}
                value={this.state.value}
                onChange={this.onChange}
                error={this.state.customError}
            />
        </div>;
    }
});

