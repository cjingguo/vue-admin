<template>
    <div id="login">
        <div class="login-wrap">
            <ul class="menu-tab">
                <!-- <li class="current" v-for="(item,index) in menuTab" :key="item.id">登录{{index}}</li> -->
                <li v-for="item in menuTab" :key="item.id" :class="{'current':item.current}" @click="toggleMenu(item)">{{item.txt}}</li>
            </ul>
            <!--表单 start -->
            <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm" class="login-form">
                <el-form-item  prop="username" class="item-from">
                    <label for="username">邮箱</label>
                    <el-input id="username" type="text"  v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item  for="password" prop="password" class="item-from">
                    <label>密码</label>
                    <el-input id="password" type="password" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>

                <el-form-item  prop="passwords" class="item-from" v-show="model === 'register'">
                    <label>重复密码</label>
                    <el-input type="password" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>

                <el-form-item  prop="code" class="item-from">
                    <label>验证码</label>
                    <el-row :gutter="11">
                        <el-col :span="15">
                          <el-input v-model="ruleForm.code"></el-input>
                        </el-col>
                        <el-col :span="9">
                            <el-button type="success" class="block" @click="getSms()" :disabled="codeButtonStatus.status">{{codeButtonStatus.text}}</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                
                <el-form-item>
                    <el-button type="danger" @click="submitForm('loginForm')" class="login-btn block" 
                    :disabled="loginButtonStatus">{{model === 'login'?"登录":"注册"}}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
// import service from "@/utils/request"
import sha1 from 'js-sha1'
import { GetSms,Register,Login } from "@/api/login.js"
// import xxx from "@/api/login.js"
// import axios from 'axios'
import { reactive,ref,isRef,toRefs, onMounted } from '@vue/composition-api'
import { stripscript,validateEmail,validatePass,validateVcode } from '@/utils/validate.js';
export default{
    name:'login',
    // setup(props, context){
    setup(props, { refs,root }){
    //  console.log(context)
        // 这里面放置data数据、生命周期、自定义的函数

       // 验证用户名是否为邮箱
      let validateUserName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if(validateEmail(value)){
            callback(new Error('用户名格式有误'));
        }
        else {
            callback(); // true
        }
      };
      // 验证密码
      let validatePassword = (rule, value, callback) => {
        console.log(stripscript(value))

        ruleForm.password = stripscript(value); // 过滤后的数据
        value = ruleForm.password;

        if (value === '') {
          callback(new Error('请输入密码'));
        }else if(validatePass(value)){
          callback(new Error('密码为6至20位数字+字母'));
        }
        else {
          callback();
        }
      };
      // 验证重复密码
      let validatePasswords = (rule, value, callback) => {
        console.log(stripscript(value))
        // 如果模块值为login,直接通过
        if(model.value ==='login'){callback();}

        ruleForm.passwords = stripscript(value); // 过滤后的数据
        value = ruleForm.passwords;

        if (value === '') {
          callback(new Error('请再次输入密码'));
        }else if(value!= ruleForm.password){
          callback(new Error('重复密码不正确'));
        }
        else {
          callback();
        }
      };
      // 验证验证码
        let validateCode = (rule, value, callback) => {

        ruleForm.code = stripscript(value); // 过滤后的数据
        value = ruleForm.code;

        if (!value) {
          return callback(new Error('请输入验证码'));
        }else if(validateVcode(value)){
            return callback(new Error('验证码输入有误'));
        }else{
            callback();
        }
      };

        /*
        * 声明数据**************************************************************************
        */
        const menuTab = reactive([
            {txt:'登录',current:true,type:'login'},
            {txt:'注册',current:false,type:'register'}
        ])
        // console.log(menuTab)

        // 模块值
        const model = ref('login') 
        // 登录按钮禁用状态
        const loginButtonStatus = ref(true)
        // 验证码按钮状态
        // const codeButtonStatus = ref(false)
        // const codeButtonText = ref('获取验证码')

        const codeButtonStatus = reactive({
            staus:false,
            text:'获取验证码'
        })
        // 倒计时
        const timer = ref(null);
        // 表单绑定数据
        const ruleForm = reactive({
            username: '',
            password: '',
            passwords:'',
            code: ''
        })

        //表单的验证
        const rules = reactive({
                username: [
                    { validator: validateUserName, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePassword, trigger: 'blur' }
                ],
                passwords: [
                    { validator: validatePasswords, trigger: 'blur' }
                ],
                code: [
                    { validator: validateCode, trigger: 'blur' }
                ]
            })

        /*
        * 声明函数************************************************************************************
        */

       /**
        * 获取验证码
       */
        const getSms = (()=> {
            // console.log(ruleForm.username)
            // 进行提示
            if(ruleForm.username ===''){
                root.$message.error('邮箱不能为空');
                return false
            }

            if(validateEmail(ruleForm.username)){
                root.$message.error('邮箱格式有误，请重新输入！！')
                return false
            }

            // 获取验证码
            let requestData ={
                username:ruleForm.username,
                module: model.value
            }

            // 修改获取验证码按钮状态
            updateButtonStatus({
                staus:true,
                text:'发送中'
            })

            // setTimeout(() =>{
                // 延时多长时间
                GetSms(requestData).then(response =>{
                    console.log(response)

                    let data = response.data
                    root.$message({
                        message: data.message,
                        type :'success'
                    })
                    // 启用登录或注册按钮
                    loginButtonStatus.value =false
                    // 调用定时倒计时
                    countDown(10)
                }).catch(error =>{
                    console.log(error)
                })
            // },3000)
        })

        const toggleMenu = (data=>{
            console.log(data)
            menuTab.forEach((elem,index)=>{
                elem.current=false; //遍历所有都改成false
            });
            // 高光
            data.current =true; // 当前选中的
            // 修改模块值
            model.value = data.type;
            resetFromData();
            clearCountDown();
        })
        
        // 清除表单数据
        const resetFromData =(() =>{
            // 重置表单
            // this.$refs[formName].resetFields(); //2.0
            refs.loginForm.resetFields(); //3.0
        })

        // 更新按钮状态
        const updateButtonStatus = ((params) =>{
            codeButtonStatus.staus = params.staus;
            codeButtonStatus.text = params.text;
        })

        /*
        * 提交表单
        */
        const submitForm = (formName=>{
            console.log(model.value)

            refs[formName].validate((valid) => {
            if (valid) {
                // 三元运算
                model.value ==='login' ? login():register()

            } else {
                console.log('error submit!!');
                return false;
            }
            })
        }) 

        /*
        * 登录
        */
        const login = (() =>{
            let requestData ={
                username:ruleForm.username,
                password:sha1(ruleForm.password),
                code: ruleForm.code
            }
            Login(requestData).then(response =>{
                console.log(response.data)
            }).catch(error =>{

            })
        })

        /*
        * 注册
        */
        const register = (() =>{
            let requestData ={
                username:ruleForm.username,
                password:sha1(ruleForm.password),
                code: ruleForm.code,
                module: 'register'
            }

            Register(requestData).then(response =>{
                console.log(response)
                let data = response.data
                root.$message({
                    message: data.message,
                    type :'success'
                })

                // 注册成功
                toggleMenu(menuTab[0])
                clearCountDown()
            }).catch(error =>{

            })
        })

        /*
        * 倒计时
        */
       const countDown = ((number) =>{
        //判断定时器是否存在，存在清除
        if(timer.value){
            clearInterval(timer.value) // 清除定时器
        }
        // setTimeout(变量) 只执行一次
           // setInterval(变量) 不断执行，需要条件才停止
        //    setTimeout(() =>{
        //        console.log('setTimeout')
        //    },1000)

        //    setInterval(() =>{
        //        console.log('setInterval')
        //    },1000)
        
        let time = number
        timer.value= setInterval(() =>{
                time--
               console.log(time)
               if(time ===0){ // 定时器停止
                   clearInterval(timer.value) // 清除定时器
                    updateButtonStatus({
                        staus:false,
                        text:'再次获取'
                    })
               }
               else{
                codeButtonStatus.text=`倒计时${time}秒` // es6写法，如果es5 '倒计时' +time +'秒'
               }
           },1000)
       })

        /*
        * 清除倒计时
        */
        const clearCountDown =(() =>{
            // 还原验证码按钮默认状态
            // codeButtonStatus.staus =false
            // codeButtonStatus.text ='获取验证码'
            updateButtonStatus({
                staus:false,
                text:'获取验证码'
            })
            clearInterval(timer.value) // 清除定时器
        })

        /*
         * 生命周期
         */
        onMounted(()=>{
            // GetSms()
            // console.log(process.env.VUE_APP_ABC)
        })

        return {
            menuTab,
            model,
            ruleForm,
            rules,
            loginButtonStatus,
            codeButtonStatus,
            getSms,
            toggleMenu,
            submitForm
        }
    },
}
</script>
<style lang="scss" scoped>
#login{
    height: 100vh; /*可视区100%高度*/
    background-color: #344a5f;
}
.login-wrap{
    width: 330px;
    margin: auto;
}
.menu-tab{
    text-align: center;
    li{
        display: inline-block; /* display: inline-block，将保留上下外边距/内边距，而 display: inline 则不会。*/
        width: 88px;
        line-height: 36px;
        font-size:14px;
        color:#fff;
        border-radius: 2px; /*圆角*/
    }
    .current{
        background-color: rgba(0,0,0,.1);
    }
}
.login-form{
    margin-top:29px;
    label{
        display: block; //label是内联元素，改成块元素
        margin-bottom: 3px;
        font-size: 14px;
        color: #fff;
    }
    .item-from{ margin-bottom: 13px;}
    .block{
        display: block; // (按钮是内联元素，改成块元素)因为按钮无法占满100%宽度，所以需要设置为块元素
        width: 100%;
    }
    .login-btn{margin-top:19px;}
}
</style>
