////////////////////////////////////////////////////////
/// SCRIPT EXECUTED BEFORE DOM CONTENT LOADED
////////////////////////////////////////////////////////
import referenceListInitializer from './reference-list-initializer';
import domainInitializer from './domain-initializer';
import definitionInitializer from './definition-initializer';
import translationInitializer from './translation-initializer';
import numeralInitializer from './numeral-initializer';

/**
 * Launch initializers that can to be executed before DOM content is loaded (asap)
 */
export default {
    initialize() {
        console.info('[INITIALIZER - BEFORE CONTENT LOADED]');
        definitionInitializer();
        domainInitializer();
        referenceListInitializer();
        translationInitializer();
        numeralInitializer();
    }
};
