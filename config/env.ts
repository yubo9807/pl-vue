
type Mode = 'development' | 'production'

export default {

  BASE_URL: '/',

  NODE_ENV: process.env.NODE_ENV as Mode,

  BASE_API: '/api',

}
