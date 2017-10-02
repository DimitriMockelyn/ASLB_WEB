import cancellablePromiseBuilder from 'focus-core/network/cancellable-promise-builder';
import {v4 as uuid} from 'uuid';
import dispatcher from 'focus-core/dispatcher';
import isObject from 'lodash/lang/isObject';
import networkConfig from 'focus-core/network/config';
import message from 'focus-core/message';
import {getConfig} from '../config';
/**
 * Create a pending status.
 * @return {object} The instanciated request status.
 */
import {map} from 'lodash/collection';

const ArgumentInvalidException = Error;

function createCORSRequest(method, url, options = {}) {
    const isCORS = options.isCORS || false;
    if (typeof method !== 'string') {
        throw new ArgumentInvalidException('The method should be a string in GET/POST/PUT/DELETE', method);
    }
    if (typeof url !== 'string') {
        throw new ArgumentInvalidException('The url should be a string', url);
    }
    let xhr = new XMLHttpRequest();

    //If CORS is not needed.
    if (!isCORS) {
        xhr.open(method, url, true);
        if (options.isBuffer) {
            xhr.responseType = 'arraybuffer';
        }
    } else {
        if ('withCredentials' in xhr) {
            // XHR for Chrome/Firefox/Opera/Safari.
            xhr.open(method, url, true);
            if (options.isBuffer) {
                xhr.responseType = 'arraybuffer';
            }
        } else if (typeof XDomainRequest !== 'undefined') {
            // XDomainRequest for IE.
            xhr = new XDomainRequest();
            xhr.open(method, url);
            if (options.isBuffer) {
                xhr.responseType = 'arraybuffer';
            }
        } else {
            // CORS not supported.
            xhr = null;
        }
    }
    map({'Content-Type': 'application/json', ...options.headers}, (value, key) => {
        xhr.setRequestHeader(key, value);
    });
    return xhr;
}


function createRequestStatus() {
    return {
        id: uuid(),
        status: 'pending'
    };
}
/**
 * Update the request status.
 * @param  {object} request - The request to treat.
 * @return {object} - The request to dispatch.
 */
function updateRequestStatus(request) {
    if(!request || !request.id || !request.status) {
        return;
    }
    dispatcher.handleViewAction({
        data: {request},
        type: 'update'
    });
    return request;
}
/**
 * Parse the response.
 * @param  {object} req - The requets object send back from the xhr.
 * @return {object}     - The parsed object.
 */
function jsonParser(req) {
    let textToParse;
    if (req.responseType === '' || req.responseType === 'text') {
        textToParse = req.responseText;
    } else {
        textToParse = new TextDecoder(req.getResponseHeader('Content-Type').split('charset=')[1].split(';')[0]).decode(new DataView(req.response));
    }
    if(null === textToParse || '' === textToParse) {
        console.warn('The response of your request was empty');
        return null;
    }
    let parsedObject;
    try {
        parsedObject = JSON.parse(textToParse);
    } catch(error) {
        parsedObject = {
            globalErrors: [{
                message: `${req.status} error when calling ${req.responseURL}`
            }]
        };
    }
    if(!isObject(parsedObject)) {
        //Maybe this check should read the header content-type
        console.warn('The response did not sent a JSON object');
    }
    return parsedObject;
}

/**
 * Fetch function to ease http request.
 * @param  {object} obj - method: http verb, url: http url, data:The json to save.
 * @param  {object} options - The options object.
 * @return {CancellablePromise} The promise of the execution of the HTTP request.
 */
function fetchFocus(obj, options = {}) {
    options.parser = options.parser || jsonParser;
    options.errorParser = options.errorParser || jsonParser;
    const verifySession = options.verifySession ? options.verifySession : true;
    const config = networkConfig.get();
    const request = createCORSRequest(obj.method, obj.url, {...config, ...options});
    const requestStatus = createRequestStatus();
    if (!request) {
        throw new Error('You cannot perform ajax request on other domains.');
    }

    return cancellablePromiseBuilder(function promiseFn(success, failure) {
        //Request error handler
        request.onerror = error => {
            updateRequestStatus({id: requestStatus.id, status: 'error'});
            if (error.target.response === '') {
                message.addErrorMessage(i18n.t('fetch.error.session'));
            }
            failure(error);
        };
        //Request success handler
        request.onload = () => {
            const status = request.status;
            if (status < 200 || status >= 300 ) {
                const err = options.errorParser(request);
                err.status = status;
                if(config.xhrErrors[status]) {
                    config.xhrErrors[status](request.response);
                }
                updateRequestStatus({id: requestStatus.id, status: 'error'});
                return failure(err);
            }
            let data;
            if (204 === status) {
                data = null;
                updateRequestStatus({id: requestStatus.id, status: 'success'});
                return success(data);
            }
            const contentType = request.contentType ? request.contentType : request.getResponseHeader('content-type');
            if (verifySession) {
                const CAS_ROOT = getConfig().CAS_ROOT;
                if ((request.responseURL && request.responseURL.startsWith(CAS_ROOT)) ||
                    (!request.responseURL && request.responseText.indexOf('DOCTYPE') !== -1)
                    ) {
                    window.location.replace(CAS_ROOT + '?service=' + window.location.href);
                }
            }
            if (contentType && contentType.indexOf('application/json') !== -1) {
                data = options.parser(request);
            } else if (options.isBuffer) {
                    data = request.response;
            } else {
                data = request.responseText;
            }
            updateRequestStatus({id: requestStatus.id, status: 'success'});
            return success(data);
        };
        updateRequestStatus({id: requestStatus.id, status: 'pending'});
        //Execute the request.
        request.send(JSON.stringify(obj.data));
    }, function cancelHandler() {
        // Promise cancel handler
        if (request.status === 0) {
            // request has not yet ended
            updateRequestStatus({id: requestStatus.id, status: 'cancelled'});
            request.abort();
            return true;
        } else {
            // trying to abort an ended request, send a warning to the console
            console.warn('Tried to abort an already ended request', request);
            return false;
        }
    });
}

const fetch = (dataFetch, options) => {
    return fetchFocus(dataFetch, options).then(res => {
        if (res && res.messages && res.messages.WARN) {
        const warnings = res.messages.WARN;
            for (const index in warnings) {
                if (warnings.hasOwnProperty(index)) {
                    message.addWarningMessage(warnings[index]);
                }
            }
        }
        return res;
    }, err=> {
        if (err.message) {
            message.addErrorMessage(err.message);
        }
        throw err;
    });
};


export default fetch;
