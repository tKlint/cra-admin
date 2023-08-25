import { request } from '@/utils/request';

const adminApi = {
  SIGN_UP(data: object) {
    return request<AdminAPIResponse.SignUp>(
      {
        url: '/api/admin/login',
        data,
        method: 'POST'
      },
      { isGetOriginResponse: true }
    );
  },
  WHO_AM_I(data: object) {
    return request<AdminAPIResponse.WhoAmI>({
      url: '/api/admin/whoami',
      data,
      method: 'GET',
      params: data
    });
  },
  cancellation(): [Promise<unknown>, AbortController] {
    const controller = new AbortController();
    const apiIns = request({
      method: 'GET',
      url: 'https://translate.google.com/?text=so,e',
      signal: controller.signal
    });
    return [apiIns, controller];
  }
};

export default adminApi;
