export default {
    type: 'text',
    validator: [{
        type: 'string',
        options: {
            minLength: 5,
            maxLength: 5,
            translationKey:'domain.error.numEtablissement'
        }
    }]
};
