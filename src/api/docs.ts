import request from "./request";

/**
 * 获取文档配置
 */
export function api_getDocsConfig() {
  return request({
    url: '/file/read',
    params: {
      path: '/plvue/config.json',
    },
  })
}

/**
 * 获取文档内容
 * @param filename 
 * @returns 
 */
export function api_getDocsContent(filename: string) {
  return request({
    url: '/file/read',
    params: {
      path: filename,
    }
  })
}
