
import HomeRouter from './home-router';
import AgendaRouter from './agenda-router';
import ActivationRouter from './activation-router';
import OtherRouter from './other-router';
export const registerRoutes = () => {
    new HomeRouter();
    new AgendaRouter();
    new ActivationRouter();
    new OtherRouter();
};
