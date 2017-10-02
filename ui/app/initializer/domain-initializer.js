import {container as domainContainer} from 'focus-core/definition/domain';
import domainsConfig from '../config/domain';
import entitytDefinitionConfig from '../config/entity-definition';
import {difference, intersection, uniq} from 'lodash/array';

function addEntityDefToArray(arr, node) {
    for (const sub in entitytDefinitionConfig[node]) {
        if (entitytDefinitionConfig[node].hasOwnProperty(sub)) {
            arr.push(entitytDefinitionConfig[node][sub].domain);
        }
    }
}

export default () => {
    console.info('|--- DOMAINS');
    domainContainer.setAll(domainsConfig);

    const arr = [];
    for (const node in entitytDefinitionConfig) {
        if (entitytDefinitionConfig.hasOwnProperty(node)) {
            addEntityDefToArray(arr, node);
        }
    }
    const appDomains = uniq(arr);
    const domains = Object.keys(domainsConfig);

    console.info('   |--- Declared domains :', domains);
    console.info('   |--- Declared domains in entity defintions :', appDomains);

    const diffAppDomains = difference(appDomains, intersection(appDomains, domains));
    const diffDomains = difference(domains, intersection(appDomains, domains));
    if(diffAppDomains.length > 0) {
        console.warn('   |--- Missing domain\'s definition :', diffAppDomains);
    }
    if(diffDomains.length > 0) {
        console.warn('   |--- Useless domain\'s definition :', diffDomains);
    }
};
