import DisplayUrlComponent from '../../components/display-url';

export default {
    type: 'url',
    validator: [{
        type: 'url'
    }],
    DisplayComponent:DisplayUrlComponent
};
