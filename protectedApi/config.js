
var devConfig = {
    url: 'http://localhost:8080',
    authMail: {
        api_key: 'key-2483ab4210c783f9455f21881ba8a152',
        domain: 'sandbox5f654a90e2fe42faa458792bd8c7bd15.mailgun.org'
      },
      filePath: "/Users/dimitrimockelyn"
}

var prodConfig = {
    url: 'http://dmockelyn-test.tk',
    authMail: {
        api_key: 'key-2483ab4210c783f9455f21881ba8a152',
        domain: 'sandbox5f654a90e2fe42faa458792bd8c7bd15.mailgun.org'
      },
      filePath: "/Users/dimitrimockelyn"
}

exports.config = {
    devConfig,
    prodConfig
};

exports.getConfig = function() {
    if (process.env.NODE_ENV === 'dev') {
        return devConfig;
    } else {
        return prodConfig;
    }
}