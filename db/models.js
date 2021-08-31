const md5 = require("blueimp-md5")
//1.连接数据库
const mongoose = require("mongoose")
//2.连接数据库:mongodb://localhost:27017/是固定格式,recruit_test是数据库 名字
mongoose.connect('mongodb://localhost:27017/recruit');
//3.获取连接对象
const conn = mongoose.connection
//4.绑定监听
conn.on('connected',()=>{
  console.log("数据连接成功")
})

//5.创建模板
const userSchema = mongoose.Schema({
  username:{type:String,require:true},
  password:{type:String,require:true},
  type:{type:String,require:true},
  header:{type:String},
  post:{type:String},
  info:{type:String},
  company:{type:String},
  salary:{type:String}
});

//集合名称：users
const UserModel = mongoose.model('user',userSchema)

module.exports = {
  UserModel
}