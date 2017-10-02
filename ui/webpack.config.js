const configBuilder = require('webpack-focus').configBuilder;
const path = require('path');
const BASE_URL = process.env.BASE_URL ? process.env.BASE_URL : '';
const customConfig = {

};

const definedVariables = {
    __BASE_URL__: `'${BASE_URL}'`
}
module.exports = configBuilder(customConfig, definedVariables);

