import builder from 'focus-core/util/url/builder';

const homeRoot = './home/';

export default {
    loadTest:  builder(homeRoot + 'test', 'GET')
};
