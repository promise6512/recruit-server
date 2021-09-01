var express = require('express');
var router = express.Router();
const md5 = require("blueimp-md5");
const {UserModel} = require('../db/models')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

//用于过滤返回的user对象的password和__v属性
const userFilter = {
  password:0,
  __v:0
}

//注册 注册路由
router.post('/register', (req, res) => {
  //1.获取请求参数
  const {username,password,type} = req.body;
  //2.处理
  UserModel.findOne({username},(err,user)=>{
    //3.返回相应数据
    if(user){
      res.send({
	      code: 1,
	      msg: "此用户已存在"
	    })
    }else{
      new UserModel({username,password:md5(password),type}).save((err,user)=>{
       // console.log(user)
        const {_id,username,type} = user;
        const data = {_id,username,type};
        //设置持久化cookie
        res.cookie('userId',_id,{maxAge:1000*60*60*24*7})
        //返回成功的响应数据
        res.send({
          code: 0,
          data
        })

      })
    }
  })

  
})

//注册 登录路由
router.post('/login',(req,res)=>{
  const {username,password} = req.body;
  UserModel.findOne({username,password:md5(password)},userFilter,(err,user)=>{
    //console.log(user)
    if(user){
      res.cookie('userId',user._id,{maxAge:1000*60*60*24*7});
      res.send({
        code: 0,
        data: user
      })
    }else{
      res.send({
	      "code": 1,
	      "msg": "用户名或密码错误"
	    })
    }
  })
})

//更新用户信息的路由
router.post('/update',(req,res)=>{
  //从请求的cookie中得到userid
  const {userId} = req.cookies;
  const userInfo = req.body;
  //如果不存在cookie不存在
  if(!userId){
    res.send({code:1,msg:"请先登录"});
    return;
  }
  UserModel.findByIdAndUpdate(userId,userInfo,(err,oldUser)=>{
    if(!err){
      if(!oldUser){
        //如果没有找到user(可能cookie被篡改),通知浏览器删除cookie
        res.clearCookie("userId")
      }else{
        const {_id,username,type} = oldUser;
        //修改成功则返回返回新的user
        res.send({
          code:0,
          data:{_id,username,type,...userInfo}
        })
      }
    }
  })
})

//自动登录的路由
router.get("/autoLogin",(req,res)=>{
  const {userId} = req.cookies;
  UserModel.findOne({_id:userId},userFilter,(err,user)=>{
    if(!err){
      res.send({
        code:0,
        data:user
      })
    }
  })
})

//获取用户列表
router.get("/userList",(req,res)=>{
  const {type} = req.query;
  UserModel.find({type},(err,users)=>{
    if(!err){
      res.send({
        code:0,
        data:users
      })
    }
  })
})
module.exports = router;
