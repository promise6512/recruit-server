var express = require('express');
var router = express.Router();
const md5 = require("blueimp-md5");
const {UserModel} = require('../db/models')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

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
module.exports = router;
