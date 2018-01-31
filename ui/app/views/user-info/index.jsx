import React from 'react';
export default React.createClass({
    displayName: 'PartenairesView',
    getInitialState() {
       return {id: this.props.id};
    },
    componentWillMount() {
    },
    /** @inheritDoc */
    render() {
        return (
            <div>
                USER {this.state.id}
            </div>
        );
    }
});
