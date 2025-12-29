import moment from 'moment';
import InputDate from '../../components/date-time-input';


export default {
    InputComponent: InputDate,
    formatter: date => {
        return date ? moment(date, moment.ISO_8601).format('DD/MM/YYYY - HH:mm') : '';
    },
    format: ['DD/MM/YYYY - HH:mm', 'DD-MM-YYYY - HH:mm ', 'D MMM YYYY - HH:mm'],
    locale: 'fr'
};
