import React from 'react';
import moment from 'moment';

export default React.createClass({
    displayName: 'TileView',
    componentWillMount() {
        this.setState({});
        console.log(this.props.data);
    },
    computeNiveau(id) {
        if (!id || !this.props.niveaux) {
            return '';
        }

        return this.props.niveaux.find(data => { return data._id === id}).name;
    },
    /** @inheritDoc */
    render() {
        let props = this.props.eventPropGetter(this.props.data);
        props.className = props.className + ' rbc-event';
        var limitString = this.props.data.limite ?  '/' + this.props.data.limite : '';
        if (this.props.data.fileAttente && this.props.data.fileAttente.length > 0 ) {
            limitString = limitString + ' (En attente : '+this.props.data.fileAttente.length+')'
        }
        return (
            <div data-focus='tile'  {...props} onClick={this.props.onClickTile}>
                <div data-focus='tile-title'>
                    {moment(this.props.data.startDate).format('HH:mm') + ' - ' + moment(this.props.data.endDate).format('HH:mm')  + '   ' + this.props.data.name + ' ' + this.computeNiveau(this.props.data.niveau)}
                </div>
                <div data-focus='tile-description'>
                    {this.props.data.description}
                </div>
                <div data-focus='tile-info'>
                    <div>{i18n.t('admin.nbInscrits') + ' ' + this.props.data.participants.length + limitString} </div>
                </div>
            </div>
        );
    }
});
