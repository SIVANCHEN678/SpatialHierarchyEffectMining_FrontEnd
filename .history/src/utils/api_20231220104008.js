import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router'
import { error } from 'jquery'

axios.defaults.baseURL='/api'

const request = axios.create({
    baseURL: 'http://localhost:8088/api',
    timeout: 5000
})

// 请求拦截器
axios.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    // 如果存在 token，请求携带这个 token( 登录的时候 把 token 存入了 sessionStorage ）
    const user =  localStorage.getItem("user")
    if (user) {
        // token 的key : Authorization ; value: tokenStr
        config.headers['token'] = JSON.parse(user).token;
    }
    return config;
},error => {
    // return Promise.reject(error)
    console.log('error'+ error)
})



//响应拦截器
// axios.interceptors.response.use(
//     response=>{
//         let res = response.data;

//         if(typeof res === 'string'){
//             res = res ? JSON.parse(res) :res
//         }
//         return res;
// },error => {
//     console.log('error'+ error)
//     // return Promise.reject(error)
//     // console.log(error)
// })
axios.interceptors.response.use(success=>{
    if(success.status&&success.status==200){
        if(success.data.code==500||success.data.code==403){
            Message.error({message: success.data.message});
            return;
        }
        if(success.data.message){
            Message.success({message:success.data.message});
        }
    }
    return success.data;
},error=>{
    if(error.response.code==504||error.response.code==404){
        Message.error({message:'找不到服务器了'});
    }
    else if(error.response.code==403){
        Message.error({message:'权限不足，请联系管理员'});
    }
    else if(error.response.code==401){
        Message.error({message:'尚未登陆，请登录'});
        router.replace('/');
    }
    else{
        if(error.response.data.message){
            Message.error({message:error.response.data.message});
        }else{
            Message.error({message:'未知错误'})
        }
    }
    return;
})
let base ='';
export const postRequest= (url,params)=>{

    return axios({
        method:'post',
        url:`${base}${url}`,
        data:params
    })
}

    // 传送 json 格式的 get 请求
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    })
}

// 传送 json 格式的 put 请求
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}

// 传送 json 格式的 delete 请求
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
}

export default request
