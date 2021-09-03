const {ChatModel} = require("../db/models")
module.exports = function(server){
  const io = require("socket.io")(server);
  //监视客户端与服务器的连接
  io.on('connection',(socket) => {
    console.log("有一个客户端连接上了服务器");

    //绑定监听,接收客户端发送的消息
    socket.on('sendMsg', ({from,to,content})=>{
      //处理数据(保存消息)
      //准备消息对象
      //console.log(from,to,content)
      const chat_id = [from,to].sort().join('_');
      const creat_time = Date.now() + '';
      //console.log(creat_time)
      new ChatModel({from,to,chat_id,content,creat_time:creat_time}).save((err,chatMsg)=>{
        if(!err){
          //向所有连接上的客户端发送消息
          //console.log(creat_time)
          io.emit('receiveMsg',chatMsg)
        }
      })
      //向客户端发送消息

    })
  })
}