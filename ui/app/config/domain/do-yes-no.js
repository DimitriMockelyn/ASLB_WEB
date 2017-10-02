import FocusComponents from 'focus-components';
import Select from '../../components/yes-no-with-disabled';

export default {
    SelectComponent: Select,
    refContainer: {yesNoList: [{code: true, label: 'select.oui'}, {code: false, label: 'select.non'}]},
    listName: 'yesNoList',
    formatter: i18n.t
};
