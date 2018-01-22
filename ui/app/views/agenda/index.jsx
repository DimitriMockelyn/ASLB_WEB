import React from 'react';
import Calendar from './calendar';
export default React.createClass({
    displayName: 'HomeView',

    componentWillMount() {
        this.setState({});
    },
    /** @inheritDoc */
    render() {
        return (
        <div>
            <div>
                <label>{i18n.t('agenda.home')}</label>
                <Calendar hasLoad={false} eventId={this.props.eventId}/>
            </div>
        </div>
        );
    }
});
