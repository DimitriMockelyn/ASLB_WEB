const DEFAULT_CONF = {
    API_ROOT: window.location.origin+':3000/'
};

//Default config on port 9999
let conf = {...DEFAULT_CONF};


export function extendConfig(newConf) {
    conf = {...conf, ...newConf};
    console.info('new conf', conf);
    return conf;
}

export function getConfig() {
    return conf;
}

export default conf;
