import { request } from '@/utils/request';

const routesApi = {
  getRoutes() {
    return request<ResponseWithPagination<RoutesAPI.routes>>({
      url: '/api/routes/routes'
    });
  }
};

export default routesApi;
