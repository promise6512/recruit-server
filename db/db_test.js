const md5 = require("blueimp-md5")
//1.连接数据库
const mongoose = require("mongoose")
//2.连接数据库:mongodb://localhost:27017/是固定格式,recruit_test是数据库名字
mongoose.connect('mongodb://localhost:27017/recruit_test');
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
  header:{type:String}
});


//集合名称：users
const UserModel = mongoose.model("user",userSchema);

const testSave = () => {
  //创建UserModel的实例
  const userModel = new UserModel({username:"Tom",password:md5('123'),type:"dashen"})
  //调用save向数据库中添加数据
  userModel.save((err,user)=>{  
    //err:错误信息
    //user:保存user信息的文档对象
    console.log(user)
  })
}
testSave()

//查询数据
//调用Model函数对象的find方法
const testFind = () => {
  UserModel.findMany()

  //查询一个
  UserModel.findOne((err,user)=>{
    console.log(user);
  })
};
//testFind();

//修改数据
const testUpdate = () => {
  UserModel.findByIdAndUpdate({_id:"612cb6fe884ff02a15625a8f"},{username:"jack"},function(err,user){
    console.log(user)
  })
}

//testUpdate()

//删除数据
function testDelete(){
  UserModel.remove({_id:"612cb6fe884ff02a15625a8f"},function(err,doc){
    console.log(doc);
  })
}
//testDelete()