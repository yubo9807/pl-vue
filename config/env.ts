
type Mode = 'development' | 'production'

export default {

  BASE_URL: '/',

  NODE_ENV: process.env.NODE_ENV as Mode,

  BASE_API: '/api',

  DEPLOY_URL: '/',  // 客户端部署目录 dist + DEPLOY_URL

}
