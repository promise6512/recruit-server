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

//定义聊天集合的模板结构
const chatSchema = mongoose.Schema({
  from: {type: String, required: true}, // 发送用户的id
  to: {type: String, required: true}, // 接收用户的id
  chat_id: {type: String, required: true}, // from和to组成的字符串
  content: {type: String, required: true}, // 内容
  read: {type:Boolean, default: false}, // 标识是否已读
  create_time: {type: Number} // 创建时间
})

//根据模板结构创建集合
const ChatModel = mongoose.model('chat',chatSchema)
module.exports = {
  UserModel,
  ChatModel
}