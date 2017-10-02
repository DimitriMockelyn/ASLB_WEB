import {registerRoutes} from './router';
import {start} from 'focus-core/history';
export default function application() {
    registerRoutes();
    start();
}
