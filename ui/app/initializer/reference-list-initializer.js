import FocusCore from 'focus-core';
//Path to the reference service.
const reference = FocusCore.reference;
import agendaService from '../services/agenda';
export default () => {
    //Place to put references like this : reference.config.set({departementsList: referenceService.loadDepartementsList});
    reference.config.set({typeEvenements: agendaService.loadTypeEvenements})
};
