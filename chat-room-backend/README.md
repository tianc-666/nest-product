user 模块 用户注册 用户登录 信息修改 不多赘述，主要是登录调用jwt 需要创建一个自定义装饰器来校验token，auth.decorator.ts ，也就是从request上获取header上的token，然后校验token是否有效，有效则继续执行，无效则返回错误信息。并且每次请求需要登录的接口 通过response.header('Authorization',token) 来延长token，实现只要用户活跃，就会延长token的过期时间，比双token更简单方便



friend-ship 模块  好友关系模块  包括好友申请 好友列表 好友删除等功能
  创建两个表 
  friend_ship 好友关系表  包括 userId friendId  创建时间 更新时间  user表上需要有两个字段来存自身好友和别人的好友是自身，也就是会有单向双向好友的概念， 需要使用@@id([userId,friendId]) 来确保每个用户的好友关系是唯一的
  friend_request 好友申请表 包括 fromUserId toUserId status 创建时间 更新时间


查询好友列表 list 接口 从friend_ship 表中查询除开自身id的其他id，然后组装用户信息返回
申请列表 接口 从friend_request 表中查询所有申请好友的用户，包括申请好友的用户信息和申请时间，记得要增加查询条件 status 为0 表示申请中
add 好友申请接口  在friend_request 表中插入一条数据，fromUserId 为当前用户，toUserId 为申请好友的用户，status 为0 表示申请中
agree 好友申请接口  在friend_request 表中更新一条数据，fromUserId 为申请好友的用户，toUserId 为当前用户，status 为1 表示同意，记得要去friend_ship 表中插入一条数据，userId 为当前用户，friendId 为申请好友的用户，status 为1 表示同意
reject 好友申请接口  在friend_request 表中更新一条数据，fromUserId 为申请好友的用户，toUserId 为当前用户，status 为2 表示拒绝

delete 删除好友接口  在friend_ship 表中删除一条数据，userId 为当前用户，friendId 为要删除的好友







// 聊天模块
创建chat websocket nest g service chat 指定websocket类型，安装@nestjs/websockets，@nestjs/platform-socket.io，socket.io 库
在gateway中通过socket.io引入WebSocketServer，定义websocket支持跨域，然后在内部创建一个加入的方法joinRoom,接受参数为client和payload，payload为加入的房间id和当前的userid，通过client.join(payload.roomId) 来加入房间,然后emit message 告诉房间内的其他用户，当前用户加入了房间
另一个方法sendMessage实现消息发送的能力，从@MessageBody 去除payload，然后通过payload传入的chatroomId,通过上面引入的WebSocketServer 来链接，this.webSocketServer.to(payload.chatroomId).emit('message', {
  type:'sendMessage',
  sendUserId:payload.sendUserId,
  message:payload.message
}) ,这里要调用chatHistory的方法来入库

prisma 定义chart-history表，包括id 发送用户的id，聊天室id，content内容，创建时间 更新时间

定义chat-history 模块，定义查询list 和 add的方法，引入prismaService，使用findMany 和 create来创建查询和新增方法，向外暴露一个查询的接口，方便查询聊天记录

