import fetch from '../utils/fetch';
import userUrl from '../config/server/user';
import userHelper from 'focus-core/user';
import utils from './utils';
export default {
    getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    computeHeaders() {
        if (this.getCookie('tokenJWT')) {
            return {
                headers: {
                    Authorization: 'JWT ' + this.getCookie('tokenJWT')
                }
            }
        }
        return {};
    },
    deleteCookie(cname) {
        document.cookie = cname + "=";
    }
    
};
