import React from 'react';

export default React.createClass({
    displayName: 'Ribbon',
    getInitialState() {
       return {id: this.props.id};
    },
    componentWillMount() {
    },
    /** @inheritDoc */
    render() {
        return (
            <div data-focus='user-ribbon'>
                <div data-focus="corner-ribbon">
                <div>
                <div>
                  <div><div>Web createur</div></div>
                </div>
              </div>
            </div>
            </div>
        );
    }
});
