import axios from 'axios'

export function request(config) {
    const instance = axios.create({
        baseURL: 'http://timemeetyou.com:8889/api/private/v1/',
        timeout: 5000
    })
    //拦截器
    instance.interceptors.request.use(config => {
        return config
    })

    instance.interceptors.response.use(res => {
        return res.data
    })

    return instance(config)
}
