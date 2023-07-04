import { message as $message } from 'antd';
import axios, { AxiosRequestConfig } from 'axios';

export interface RequestOptions {
  /** 当前接口权限, 不需要鉴权的接口请忽略， 格式：sys:user:add */
  permCode?: string;
  /** 是否直接获取data，而忽略message等 */
  isGetDataDirectly?: boolean;
  /** 请求成功是提示信息 */
  successMsg?: string;
  /** 请求失败是提示信息 */
  errorMsg?: string;
  /** 是否mock数据请求 */
  isMock?: boolean;
}

const UNKNOWN_ERROR = '未知错误，请重试';

/** 真实请求的路径前缀 */
const baseApiUrl = process.env.BASE_API || '';
/** mock请求路径前缀 */
const baseMockUrl = process.env.MOCK_API || '';
console.log('baseApiUrl', baseApiUrl);
console.log('baseMockUrl', baseMockUrl);

const service = axios.create({
  // baseURL: baseApiUrl,
  timeout: 6000
});

service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('ACCESS_TOKEN_KEY');
    if (token && config.headers) {
      // 请求头token信息，请根据实际情况进行修改
      config.headers['Authorization'] = token;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    const res = response.data;

    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 200) {
      $message.error(res.message || UNKNOWN_ERROR);

      // Illegal token
      if (res.code === 11001 || res.code === 11002) {
        window.localStorage.clear();
        window.location.reload();
        // to re-login
        // Modal.confirm({
        //   title: '警告',
        //   content: res.message || '账号异常，您可以取消停留在该页上，或重新登录',
        //   okText: '重新登录',
        //   cancelText: '取消',
        //   onOk: () => {
        //     localStorage.clear();
        //     window.location.reload();
        //   }
        // });
      }

      // throw other
      const error = new Error(res.message || UNKNOWN_ERROR) as Error & { code: number };
      error.code = res.code;
      return Promise.reject(error);
    } else {
      return res;
    }
  },
  error => {
    // 处理 422 或者 500 的错误异常提示
    const errMsg = error?.response?.data?.message ?? UNKNOWN_ERROR;
    $message.error(errMsg);
    error.message = errMsg;
    return Promise.reject(error);
  }
);

export type Response<T = Record<string, unknown>> = {
  code: number;
  message: string;
  data: T;
};

export type BaseResponse<T = Record<string, unknown>> = Promise<Response<T>>;

/**
 *
 * @param method - request methods
 * @param url - request url
 * @param data - request data or params
 */
export const request = async <T = Record<string, unknown>>(
  config: AxiosRequestConfig,
  options: RequestOptions = {}
): Promise<T> => {
  try {
    const { successMsg, errorMsg, permCode, isMock = false, isGetDataDirectly = true } = options;
    console.log(isMock, 'mock');
    if (permCode) {
      return $message.error('你没有访问该接口的权限，请联系管理员！');
    }
    const fullUrl = `${config.url}`;
    config.url = fullUrl.replace(/(?<!:)\/{2,}/g, '/');

    const res = await service.request(config);
    successMsg && $message.success(successMsg);
    errorMsg && $message.error(errorMsg);
    return isGetDataDirectly ? res.data : res;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
};

// export default {}
