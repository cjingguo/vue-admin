<template>
    <div id="login">
        <div class="login-wrap">
            <ul class="menu-tab">
                <!-- <li class="current" v-for="(item,index) in menuTab" :key="item.id">登录{{index}}</li> -->
                <li v-for="item in menuTab" :key="item.id" :class="{'current':item.current}" @click="toggleMenu(item)">{{item.txt}}</li>
            </ul>
            <!--表单 start -->
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="login-form">
                <el-form-item  prop="username" class="item-from">
                    <label>用户</label>
                    <el-input type="text"  v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item  prop="password" class="item-from">
                    <label>密码</label>
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>

                <el-form-item  prop="passwords" class="item-from" v-show="model === 'register'">
                    <label>重复密码</label>
                    <el-input type="password" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>

                <el-form-item  prop="code" class="item-from">
                    <label>验证码</label>
                    <el-row :gutter="11">
                        <el-col :span="15">
                          <el-input v-model.number="ruleForm.code"></el-input>
                        </el-col>
                        <el-col :span="9">
                            <el-button type="success" class="block">获取验证码</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                
                <el-form-item>
                    <el-button type="danger" @click="submitForm('ruleForm')" class="login-btn block">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { reactive,ref,isRef,toRefs, onMounted } from '@vue/composition-api'
import { stripscript,validateEmail,validatePass,validateVcode } from '@/utils/validate.js';
export default{
    name:'login',
    // setup(props, context){
    setup(props, { refs }){
    
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
        * 声明数据
        */
        const menuTab = reactive([
            {txt:'登录',current:true,type:'login'},
            {txt:'注册',current:false,type:'register'}
        ])
        // console.log(menuTab)

        // 模块值
        const model = ref('login') 
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
        * 声明函数
        */

        const toggleMenu = (data=>{
            console.log(data)
            menuTab.forEach((elem,index)=>{
                elem.current=false; //遍历所有都改成false
            });
            data.current =true; // 当前选中的
            // 修改模块值
            model.value = data.type;
        })
        
        const submitForm = (formName=>{
            refs[formName].validate((valid) => {
            if (valid) {
                alert('submit!');
            } else {
                console.log('error submit!!');
                return false;
            }
            })
        }) 

        /**
         * 生命周期
         */
        onMounted(()=>{

        })

        return {
            menuTab,
            model,
            ruleForm,
            rules,
            toggleMenu,
            submitForm
        }
    },
    // 挂载完成后执行
    // mounted() { 
    // },
    // 写函数的地方
    // methods:{
    //     toggleMenu(data){
    //         // console.log(data)
    //         this.menuTab.forEach(elem=>{
    //             elem.current=false; //遍历所有都改成false
    //         });
    //         data.current =true // 当前选中的
    //         // 修改模块值
    //         this.model = data.type
    //     },
    //      submitForm(formName) {
    //     this.$refs[formName].validate((valid) => {
    //       if (valid) {
    //         alert('submit!');
    //       } else {
    //         console.log('error submit!!');
    //         return false;
    //       }
    //     });
    //     },
    // }
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
