//libraries
import React, {Component, PropTypes} from 'react';
import userHelper from 'focus-core/user';
import Input from 'focus-components/components/input/text';
import DateTimeInput from 'react-datetime';

export default React.createClass({
    getValue(){
        return this.state.value;
    },
    getInitialState() {
        return {value: this.props.value};
    },
    onChangeDate(date) {
        this.setState({value: date});
    },
    render() {
        console.log(this.props.value);
        return (
            <DateTimeInput
                locale="fr-FR"
                value={this.state.value}
                ref='field'
                onChange={this.onChangeDate}
                />);
    }
});

