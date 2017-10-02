
import HomeRouter from './home-router';
import AgendaRouter from './agenda-router';
export const registerRoutes = () => {
    new HomeRouter();
    new AgendaRouter();
};
