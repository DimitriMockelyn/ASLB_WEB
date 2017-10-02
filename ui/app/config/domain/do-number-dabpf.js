import DisplayNumberComponent from '../../components/display-number';
import InputNumberComponent from '../../components/input-default-zero';
export default {
    type: 'text',
    DisplayComponent: DisplayNumberComponent,
    InputComponent: InputNumberComponent,
    validator: [{
        type: 'number'
    }]
};
