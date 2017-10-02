import {CoreStore} from 'focus-core/store';
import ListStore from 'focus-core/store/list';
/**
* Store dealing with subjects about persons.
* @type {focus}
*/

const dernieresConsultationOfStore =  new ListStore({identifier: 'dernieresConsultationOf'});
const dernieresModificationOfByOfStore =  new ListStore({identifier: 'dernieresModificationOfByOf'});
const dernieresConsultationBpfStore = new ListStore({identifier: 'dernieresConsultationBpf'});

const dernieresCreationOfStore = new ListStore({identifier: 'dernieresCreationOf'});

const homeStore = new CoreStore({
    definition: {
        stats: 'stats'
    }
});

export default ({
    dernieresConsultationOfStore,
    dernieresModificationOfByOfStore,
    dernieresConsultationBpfStore,
    dernieresCreationOfStore,
    homeStore
});
