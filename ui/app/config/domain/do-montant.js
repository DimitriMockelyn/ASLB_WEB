import {isUndefined, isNull, isNaN, isNumber} from 'lodash/lang';
import DisplayMontantComponent from '../../components/display-montant';

function isNullOrNan(value) {
    return isUndefined(value) ||
        isNull(value) ||
        isNaN(+value);
}

function checkPunctuationMontant(value) {
    return value.toString().endsWith('.') ||
        (value.toString().startsWith('-') && value.toString().endsWith('-') );
}

function isValueNotMontant(value) {
    return isNullOrNan(value) ||
        !isNumber(+value) ||
        checkPunctuationMontant(value);
}

function formatValue(value) {
    return value==='' ? value : isValueNotMontant(value) ? value :  Math.trunc((+value) * 100) / 100;
}

export default {
    type: 'text',
    DisplayComponent: DisplayMontantComponent,
    formatter : formatValue,
    validator: [{
        type: 'function',
        value: value => {
            if (isUndefined(value) || isNull(value)) {
                return false;
            }
            const number = +value;
            if (isNaN(number) || !isNumber(number)) {
                return false;
            }

            return true;
        },
        options: {translationKey:'domain.error.montant'}
    }]
};
