
const NODE_ENV = process.env.NODE_ENV as 'development' | 'production';

export default Object.freeze({

  BASE_URL: '',

  NODE_ENV,

  // BASE_API: NODE_ENV === 'development' ? '/api' : 'http://hicky.hpyyb.cn/api',
  BASE_API: 'http://127.0.0.1:20010/api',

  GITHUB_URL: 'https://github.com/yubo9807/',

})
