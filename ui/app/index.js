import 'babel-preset-focus/dist/focus-polyfill';

import focusDemoConf from '../package.json';
import focusCoreConf from 'focus-core/package.json';
import focusComponentsConf from 'focus-components/package.json';

// initializers before DOM CONTENT LOADED
import beforeDomContentLoadedScript from './initializer/before';
import afterDomContentLoadedScript from './initializer/after';
beforeDomContentLoadedScript.initialize();
import userInitializer from './initializer/user-initializer';

// initializers after DOM CONTENT LOADED
const onDOMContentLoaded = () => {
    userInitializer().then(() => {
        afterDomContentLoadedScript.initialize();
        require('./application')();
    })
};

window.onDOMContentLoaded = onDOMContentLoaded;

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

//import app demo styles
import './styles';
