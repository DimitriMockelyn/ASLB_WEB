import {isUndefined, isNull, isNaN, isNumber} from 'lodash/lang';

export default {
    type: 'text',
    validator: [{
        type: 'function',
        value: value => {
        if (isUndefined(value) || isNull(value)) {
            return true;
        }
        //Cast it into a number.
        const castNumberToValidate = +value;
        if (isNaN(castNumberToValidate)) {
            return false;
        }
        if(!isNumber(castNumberToValidate)){
            return false;
        }
        return !isNaN(value) && parseInt(Number(value),10) === castNumberToValidate && !isNaN(parseInt(value, 10));
      },
      options:{translationKey:'domain.error.integer'}
    }]
};
