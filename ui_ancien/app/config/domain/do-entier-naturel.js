import isRealNumber from '../../utils/is-real-number';
import DisplayNumberComponent from '../../components/display-number';
export default {
    type: 'text',
    DisplayComponent: DisplayNumberComponent,
    validator: [{
        type: 'function',
        value: value => {
            const isRealNumberValue = isRealNumber(value);
            if (isRealNumberValue !== undefined) {
                return isRealNumberValue;
            }
            if (value % 1 !== 0){
                return false;
            }
            if (value < 0){
                return false;
            }
            return true;
        },
        options: {translationKey:'domain.error.positiveinteger'}
    }]
};
