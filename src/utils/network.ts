import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios-minified";

export interface SateConfig extends AxiosRequestConfig {
  noTips?: boolean
}



export class Request {

  config: SateConfig
  instance: AxiosInstance

  /**
   * 拦截器封装，对返回数据进行了简单处理
   * @note 断网提示，统一报错
   * @note 适用于多个模块共用一个 token 的情况
   * @param config 
   */
  constructor(config: SateConfig) {

    this.config = config;
    this.instance = axios.create(config);

    this.instance.interceptors.request.use(config => this.requestUse(config))

    this.instance.interceptors.response.use((response) => {
      return this.responseUse(response);
    }, error => {
      const { response, config, message } = error;      
      if (response && response.data) return this.responseUse(response);

      // 响应出现错误（连接超时/网络断开/服务器忙没响应）
      // Notification.closeAll();
      // Notification({
      //   title: '网络可能存在一些问题',
      //   message: error.message || '错误原因：网络断开/无法连接/网络差/连接超时/服务器忙，请尝试重新操作或刷新页面',
      //   duration: null,
      // })
      
      // 返回统一数据格式，不会导致代码取不到 code 而报错
      const { url } = error.config;
      return Promise.reject({
        code: 500,
        msg: message || 'network error: ' + url,
      });
    })
  }

  /**
   * 请求拦截
   * @note 多个子系统共用一个 token，不共用时请重写
   * @param config 
   * @returns 
   */
  requestUse(config: AxiosRequestConfig) {
    return config;
  }

  /**
   * 统一拦截处理
   * @param response 
   * @returns 
   */
  responseUse(response: AxiosResponse): Promise<any> {
    const data = response.data;

    // 找对应的处理函数，没有的话交给 this.error 处理
    const handleFunc = this[data.code] || this.error;
    return handleFunc(response);
  }

  /**
   * 请求成功
   * @param response 
   * @returns 
   */
  200(response: AxiosResponse): Promise<any> {
    return Promise.resolve(response.data);
  }

  /**
   * 请求失败
   * @param response 
   * @returns 
   */
  error(response: AxiosResponse): Promise<any> {
    const { data, config } = response;
    // !(config as SateConfig).noTips && Message.error(data.message);
    return Promise.reject(data);
  }

}



/**
 * 请求函数封装，以数组形式返回
 * @param promise 请求函数
 * @returns [err, res] 通常情况下只有一项为 null
 */
export function asyncto(promise: Promise<any>) {
  return promise
    .then(data => [ null, data ])
    .catch(err => [ err, null ]);
}



/**
 * 断网提示
 */
export function fractureTips() {
  window.addEventListener('online', () => {
    // Message.closeAll();
    // Message.success('网络恢复');
  })
  window.addEventListener('offline', () => {
    // Message({
    //   type: 'error',
    //   message: '网络中断',
    //   duration: 0,
    //   showClose: true
    // });
  })
}