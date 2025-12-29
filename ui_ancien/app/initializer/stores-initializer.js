import FocusCore from 'focus-core';
import builtInReferenceAction from 'focus-core/reference/built-in-action';
import {advancedSearchStore} from 'focus-core/search/built-in-store';
export default () => {
        /*const loadReferences =*/
        builtInReferenceAction(['scopes']);

        /*pour ajouter des references : loadReferences().then(() => {
            FocusCore.dispatcher.handleServerAction({
                data: {
                    scope: 'OF'
                },
                type: 'update',
                identifier: advancedSearchStore.identifier
            });
        });*/
};
