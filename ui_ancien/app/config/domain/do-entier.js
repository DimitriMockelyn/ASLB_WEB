import isRealNumber from '../../utils/is-real-number';
export default {
    type: 'text',
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
          return true;
        },
        options: {translationKey:'domain.error.integer'}
    }]
};
