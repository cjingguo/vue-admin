import service from "@/utils/request"

/*
* 获取验证码
*/
export function GetSms(data){
   return service.request({
        method:"post",
        url:"/getSms/",
        data
        // data:data
        // data:data，左边的data是后台接受的，右边的data是参数
        // 如果两者都是同名，可以写成一个
    })
}

/*
* 获取用户角色
*/

/*
* 登录
*/
export function Login(data){
    return service.request({
         method:"post",
         url:"/login/",
         data
     })
 }

/*
* 注册
*/
export function Register(data){
    return service.request({
         method:"post",
         url:"/register/",
         data
     })
 }