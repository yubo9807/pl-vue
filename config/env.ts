
type Mode = 'development' | 'production'

export default {

  BASE_URL: '/',

  MODE: (import.meta as any).env.MODE as Mode,

  SSR: (import.meta as any).env.SSR as boolean,

  BASE_API: '/api',

}
