import {isUndefined, isNull, isNaN, isNumber} from 'lodash/lang';

function isNotGoodNumber(value, castNumberToValidate) {
    return isNaN(value) || parseInt(Number(value), 10) !== castNumberToValidate || isNaN(parseInt(value, 10));
}

export default value => {
    if (isUndefined(value) || isNull(value)) {
        return true;
    }
    //Cast it into a number.
    const castNumberToValidate = +value;
    if (isNaN(castNumberToValidate) || !isNumber(castNumberToValidate) || isNotGoodNumber(value, castNumberToValidate)) {
        return false;
    }
    return undefined;
};
