import moment from 'moment';
import InputDate from 'focus-components/components/input/date';


export default {
    InputComponent: InputDate,
    formatter: date => {
        return date ? moment(date, moment.ISO_8601).format('DD/MM/YYYY') : '';
    },
    format: ['DD/MM/YYYY', 'DDMMYYYY'],
    locale: 'fr'
};
