

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
                if (value._id.toString() === values[index].toString()) {
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
                res.push(value._id.toString());
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
                if (value._id.toString() === code) {
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
    render() {
        const that = this;
        if (!this.props.isEdit) {
            const values = this.getValue();
            console.log(this.state, values)
            return <div>
                {this.state.list.map(value => {
                    if (values.indexOf(value._id) > -1) {
                        return <div>{value.name}</div>
                    }
                })}
            </div>
        }
        return (
                <div>
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
                                    label={value.name}
                                    onChange={that.onChangeToggle(value._id.toString())}
                                    value={value.toggle}
                                />
                            </div>
                        );
                    })}
                </div>
        );
    }
});
