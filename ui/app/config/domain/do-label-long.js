export default {
    type: 'text',
    validator: [{
        type: 'string',
        options: {
            maxLength: 200
        }
    }],
    unformatter: input => {
        if (input) {
            return input;
        }
        return '';}
};
