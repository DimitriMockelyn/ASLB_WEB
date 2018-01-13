import FocusCore from 'focus-core';
import fetch from 'focus-core/network/fetch';
import userHelper from 'focus-core/user';
import userServices from '../services/user';


export default () => {
        userHelper.setRoles(['DEFAULT_ROLE']);
        return userServices.loadMe().then( res => {
            userHelper.setLogin(res);
        });
};
