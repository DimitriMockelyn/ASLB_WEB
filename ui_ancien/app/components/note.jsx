//libraries
import React, {Component, PropTypes} from 'react';
import StarRatingComponent from 'react-star-rating-component';

export default React.createClass({
    getInitialState() {
        return {value: this.props.value};
    },
    componentWillReceiveProps(newProps) {
        this.setState({value: newProps.value});
    },
    getValue(){
        return this.state.value;
    },
    onChange(nextValue, prevValue, name) {
        console.log(nextValue, prevValue, name)
        this.setState({value: nextValue/2.0});
    },
    render() {
        return (
            <StarRatingComponent 
                    name="" 
                    starCount={10}
                    starColor="#ffb400"
                    emptyStarColor="#ffb400"
                    value={this.state.value*2}
                    onStarClick={this.onChange}
                    ref='rating'
                    renderStarIcon={(index, value) => {
                        return <i className='material-icons'>{index <= value ? 'star' : 'star_border'} </i>;
                    }}
                    editing={!this.props.isConsult}
                    renderStarIconHalf={() => <i className='material-icons'>star_half</i>}
                />);
    }
});

