////////////////////////////////////////////////////////
/// SCRIPT EXECUTED AFTER DOM CONTENT LOADED
////////////////////////////////////////////////////////
import React from 'react';
import globalLinkInitializer from './global-link-initializer';
import storesInitializer from './stores-initializer';
import headerInitializer from './header-initializer';
import routerInitializer from './router-initializer';
import layoutInitializer from './layout-initializer';

/**
 * Launches initializers that has to be loaded after DOM content is loaded.
 */
export default {
    initialize() {
        console.info('[INITIALIZER - AFTER CONTENT LOADED]');
        globalLinkInitializer();
        storesInitializer();
        layoutInitializer();
        headerInitializer();
        routerInitializer();
    }
};
