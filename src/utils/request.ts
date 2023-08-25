import { message as $message, Modal } from 'antd';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import storage from './Storage';

export interface RequestOptions {
  /** 当前接口权限, 不需要鉴权的接口请忽略， 格式：sys:user:add */
  permCode?: string;
  /** 是否直接获取data，而忽略message等 */
  isGetDataDirectly?: true;
  /** 请求成功是提示信息 */
  successMsg?: string;
  /** 请求失败是提示信息 */
  errorMsg?: string;
  /** 是否mock数据请求 */
  isMock?: boolean;
  /**
   * 获取原始请求响应
   */
  isGetOriginResponse?: false;
}

const UNKNOWN_ERROR = '未知错误，请重试';

/** 真实请求的路径前缀 */
const baseApiUrl = process.env.BASE_API || '';
/** mock请求路径前缀 */
// const baseMockUrl = process.env.MOCK_API || '';

const service = axios.create({
  baseURL: baseApiUrl,
  timeout: 6000
});

service.interceptors.request.use(
  config => {
    const token = storage.get('access_token', '');
    if (token && config.headers) {
      // 请求头token信息，请根据实际情况进行修改
      config.headers['Authorization'] = `Bearer ${token}`;
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
    if (res.code !== 0) {
      const noticeMsg = res.message || res.msg || UNKNOWN_ERROR;
      $message.error(noticeMsg);
      const error = new Error(noticeMsg) as Error & { code: number };
      error.code = res.code;
      return Promise.reject(error);
    } else {
      return response;
    }
  },
  (error: AxiosError<Response>) => {
    if (error.code === 'ERR_CANCELED') {
      $message.warning(error.message);
    } else if (error.response?.status === 403) {
      Modal.confirm({
        title: '授权已过期',
        content: '授权过期,请重新登陆!',
        afterClose: () => {
          storage.remove('access_token');
          storage.remove('user_no');
          storage.remove('avatar_url');
          window.location.reload();
        }
      });
    } else {
      const errMsg = error.response?.data.msg ?? UNKNOWN_ERROR;
      $message.error(errMsg);
      error.message = errMsg;
    }
    return Promise.reject(error);
  }
);

export type Response<T = Record<string, unknown>> = {
  code: number;
  message: string;
  msg: string;
  data: T;
};

export type BaseResponse<T = Record<string, unknown>> = Promise<Response<T>>;

type RequestIns<T = Record<string, unknown>> = {
  <T>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T>;
  (
    config: AxiosRequestConfig,
    options?: Omit<RequestOptions, 'isGetDataDirectly'> & {
      isGetDataDirectly: false;
    }
  ): Promise<Response<T>>;
  <T>(
    config: AxiosRequestConfig,
    options?: Omit<RequestOptions, 'isGetOriginResponse'> & {
      isGetOriginResponse: true;
    }
  ): Promise<AxiosResponse<Response<T>>>;
};

/**
 *
 * @param method - request methods
 * @param url - request url
 * @param data - request data or params
 */
export const request: RequestIns = async (
  config: AxiosRequestConfig,
  options: Omit<RequestOptions, 'isGetOriginResponse' | 'isGetDataDirectly'> & {
    isGetDataDirectly?: boolean;
    isGetOriginResponse?: boolean;
  } = {}
) => {
  try {
    const { successMsg, errorMsg, permCode, isGetDataDirectly = true, isGetOriginResponse = false } = options;
    if (permCode) {
      return $message.error('你没有访问该接口的权限，请联系管理员！');
    }
    const fullUrl = `${config.url}`;
    config.url = fullUrl.replace(/(?<!:)\/{2,}/g, '/');

    const res = await service.request<BaseResponse>(config);
    if (isGetOriginResponse) {
      return res;
    }
    successMsg && $message.success(successMsg);
    errorMsg && $message.error(errorMsg);
    return isGetDataDirectly ? (await res.data).data : res;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
};

// export default {}
