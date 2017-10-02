import FocusCore from 'focus-core';
import fetch from 'focus-core/network/fetch';
import userHelper from 'focus-core/user';

export default () => {
        userHelper.setRoles(['DEFAULT_ROLE']);
};
