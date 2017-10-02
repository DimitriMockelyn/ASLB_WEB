

//libraries
import React, {Component, PropTypes} from 'react';
import {Checkbox} from 'focus-components/components/input';

import {translate} from 'focus-core/translation';


export default React.createClass({
    displayName: 'CheckboxSelect',
    propTypes: {
        hasAll: PropTypes.bool.isRequired,
        hasToggle: PropTypes.bool.isRequired,
        isOneRequired: PropTypes.bool,
        label: PropTypes.string.isRequired,
        list: PropTypes.array.isRequired,
        value: PropTypes.array.isRequired
    },
    getInitialState() {
        return {
            allToggle: false,
            toggle: false,
            list: this._buildListState(this.props.list, this.props.value)
        };
    },
    componentWillReceiveProps(newProps) {
        if (newProps.list && newProps.value) {
            this.setState({
                list: this._buildListState(newProps.list, newProps.value)
            });
        }
    },
    _buildListState(listIn, values) {
        const list = listIn || [];
        list.map(value => {
            value.toggle = false;
            for (const index in values) {
                if (value.code === values[index]) {
                    value.toggle = true;
                }
            }
        });
        return list;
    },
    getValue() {
        const res = [];
        this.state.list.map(value => {
            if (value.toggle) {
                res.push(value.code);
            }
        });
        return res;
    },
    toggle() {
        this.setState({
            toggle: !this.state.toggle
        });
    },
    onChangeToggle(code) {
        return () => {
            const list = this.state.list;
            list.map(value => {
                if (value.code === code) {
                    value.toggle = !value.toggle;
                }
            });
            this.setState({list, error: undefined});
        };
    },
    onChangeAllToggle() {
        const that = this;
        if (!this.state.allToggle) {
            this.state.list.map(value => {
                if (!value.toggle) {
                    that.onChangeToggle(value.code)();
                }
            });
        } else {
            this.state.list.map(value => {
                if (value.toggle) {
                    that.onChangeToggle(value.code)();
                }
            });
        }
        this.setState({
            allToggle: !this.state.allToggle
        });
    },
    validate() {
        if (this.props.isOneRequired && this.getValue().length === 0) {
            this.setState({error: translate('field.required', {name: translate(this.props.label)})});
            return false;
        }
    },
    render() {
        const that = this;
        return (
            <div
                className="mdl-grid"
                data-domain="checkbox-select"
                data-focus="field"
                data-mode="edit"
                data-required={this.props.isOneRequired ? 'true' : 'false'}
                data-valid={this.state.error ? 'false' : 'true'}
            >
                <div
                    className="mdl-cell mdl-cell--top mdl-cell--4-col"
                    data-focus="field-label-container"
                >
                    <label data-focus="label">{translate(this.props.label)}</label>
                {this.props.hasToggle &&
                    <i
                        className="material-icons focusable"
                        onClick={this.toggle}
                    >
                        {this.state.toggle ? 'arrow_drop_up' : 'arrow_drop_down'}
                    </i>
                }
                </div>
                <div
                    className={(this.state.toggle || !this.props.hasToggle ?'visible ' : 'hidden ') + 'mdl-cell mdl-cell--top mdl-cell--8-col'}
                    data-focus="field-value-container"
                >
                    {this.props.hasAll && <div>
                        <Checkbox
                            label='Tous'
                            onChange={this.onChangeAllToggle}
                            value={this.state.allToggle}
                        />
                    </div>}
                    {(this.state.toggle || !this.props.hasToggle) && this.state.list.map(value => {
                        return (
                            <div>
                                <Checkbox
                                    label={value.label}
                                    onChange={that.onChangeToggle(value.code)}
                                    value={value.toggle}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
});
