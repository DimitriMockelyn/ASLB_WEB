import DisplayNumberComponent from '../../components/display-number';
export default {
    type: 'text',
    DisplayComponent: DisplayNumberComponent,
    validator: [{
        type: 'number'
    }]
};
