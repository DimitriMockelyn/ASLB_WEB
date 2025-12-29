import homeServices from '../services/home';
import {dernieresConsultationOfStore, dernieresConsultationBpfStore, dernieresCreationOfStore,dernieresModificationOfByOfStore} from '../stores/home';
import listActionBuilder from 'focus-core/list/action-builder';
import actionBuilder from 'focus-core/application/action-builder';

export const dernieresConsultationOfAction = {
    loadList: listActionBuilder({
            service: homeServices.loadDernieresConsultationOf,
            identifier: 'dernieresConsultationOf',
            getListOptions: () => {
                return dernieresConsultationOfStore.getValue();
            } }
    )
};

export const dernieresModificationOfByOfAction = {
    loadList: listActionBuilder({
            service: homeServices.loadDernieresModificationOfByOf,
            identifier: 'dernieresModificationOfByOf',
            getListOptions: () => {
                return dernieresModificationOfByOfStore.getValue();
            } }
    )
};

export const dernieresConsultationBpfAction = {
    loadList: listActionBuilder({
            service: homeServices.loadDernieresConsultationBpf,
            identifier: 'dernieresConsultationBpf',
            getListOptions: () => {
                return dernieresConsultationBpfStore.getValue();
            } }
    )
};

export const dernieresCreationOfAction = {
    loadList: listActionBuilder({
            service: homeServices.loadDernieresCreationOf,
            identifier: 'dernieresCreationOf',
            getListOptions: () => {
                return dernieresCreationOfStore.getValue();
            } }
    )
};

export const statsAction = {
    load: actionBuilder({
        node: 'stats',
        service: homeServices.loadStats,
        shouldDumpStoreOnActionCall: true,
        status: 'loaded'
    })
};
