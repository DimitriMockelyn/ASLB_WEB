export default {
    type: 'number',
    validator: [{
        type: 'number',
        options: {min:0, max:100, translationKey:'domain.error.pourcentage'}
    }]
};
