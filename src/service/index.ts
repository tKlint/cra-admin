import adminApi from './admin';
import routesApi from './routes';

const api = {
  ...adminApi,
  ...routesApi
};
export default api;
