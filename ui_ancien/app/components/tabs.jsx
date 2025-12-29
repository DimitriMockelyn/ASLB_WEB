//libraries
import React, {Component, PropTypes} from 'react';
import StarRatingComponent from 'react-star-rating-component';

export default React.createClass({
    getDefaultProps() {
        return {
            tabs: []
        }
    },
    getInitialState() {
        return {selectedTab: this.props.initialTab || 0};
    },
    render() {
        const selected = this.props.tabs[this.state.selectedTab];
        return (
            <div> 
                <div data-focus='tab-array'>
                    {this.props.tabs.length > 0 && this.props.tabs.map((data, index) => {
                        return <div className={this.state.selectedTab === index ? 'tab-active' : ''} onClick={() => {this.setState({selectedTab: index})}}>{data.name}</div>
                    })}
                </div>
                {this.props.tabs.length > 0 && <selected.component {...selected.props} />}
            </div>);
    }
});

