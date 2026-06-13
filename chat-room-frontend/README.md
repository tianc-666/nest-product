




聊天模块
  引入socket.io-client库，在useEffcet通过io("http://localhost:3000")链接，监听connect事件，连接成功后，识别当前的roomId，加入房间，点击或者刷新页面，定义接受消息的messageList，也是在useEffect监听事件，事件触发后，加入到messageList中 监听message事件，事件触发后，加入到messageList中

  发送消息的方法，通过socketRef.current?.emit("sendMessage", payload2); 发送消息


  聊天室逻辑
  1.好友列表点击聊天创建单聊
    判断是否已经存在单聊，直接navegate跳转，不存在就创建单聊
  2.群聊列表点击聊天
    判断是否已经加入群聊，直接navegate跳转，不存在就加入群聊
  3.群聊用户详情调用接口，获取群聊用户详情，
