import FocusCore from 'focus-core';
//Path to the reference service.
const reference = FocusCore.reference;
import agendaService from '../services/agenda';
import userService from '../services/user';
export default () => {
    //Place to put references like this : reference.config.set({departementsList: referenceService.loadDepartementsList});
    reference.config.set({typeEvenements: agendaService.loadTypeEvenements});
    reference.config.set({typeSexe: userService.loadSexes});
    reference.config.set({typeEntreprise: userService.loadEntreprises});
    reference.config.set({niveauEvenements: agendaService.loadNiveauEvenements});
};
