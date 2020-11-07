/**
 * 文章相关的请求模块
 */
import request from '@/util/request'

/**
 * 获取文章列表
 */
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })
}

/**
 * 获取文章详情
 */
export const getArticleDetail = id => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${id}`
  })
}
