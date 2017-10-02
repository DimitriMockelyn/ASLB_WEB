import DisplayDaComponent from '../../components/display-da';

export default {
    type: 'text',
    DisplayComponent: DisplayDaComponent,
    validator: [{
        type: 'string',
        options: {
            maxLength: 15
        }
    }]
};
