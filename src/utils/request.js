import axios from 'axios';
import { Message } from 'element-ui';

// 创建axios,赋给变量service
// 手把手撸马前端API，地址 http://www.web-jshtml.cn/productApi
const BASEURL = process.env.NODE_ENV === "production" ? process.env.VUE_APP_API : process.env.VUE_APP_API;
const service = axios.create({
    baseURL: BASEURL, // http://localhost:8080/api/ 替换  
    timeout: 10000,
});

// console.log(process.env.NODE_ENV)
// console.log(process.env.VUE_APP_ABC)

// 添加请求拦截器
/**
 *  请求接口前，做一些数据处理(请求拦截器)
 * 后端需要在请求头添加参数
*/
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    console.log(config.headers)
    // 业务需求
    config.headers['Tokey']='123' //在请求头添加参数
    // config.headers.Tokey = '123'

    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
/*
* 请求接口，返回数据进行拦截(响应拦截器)
*/
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log(response)
    let data = response.data

    if(data.resCode !==0){
        // alert(1111)
        Message.error(data.message);
        return Promise.reject(data); // 将错误信息返回
    }else{
      return response; // resCode=0 没有出错返回 response
      // return Promise.resolve;
    }
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });

export default service;