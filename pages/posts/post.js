// pages/posts/post.js
var postData = require('../../data/post_data.js')
//获取数据
Page({
  data:{
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
  },
  onLoad:function(){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      post_key: postData.postList
    });  //绑定该变量值到data里边
    var postKey = this.data.post_key;
    for (var i in postKey) {
      var orTitle = postKey[i].title;
      var postAbstract = postKey[i].detail;
      if (orTitle.length >8) {
        orTitle = orTitle.substring(0, 6) + "..."
      }
      if(postAbstract.length > 74) {
        postAbstract = postAbstract.substring(0,73) + "..."
      }
      postKey[i].title = orTitle;
      postKey[i].detail = postAbstract;
    }
    this.setData({
      post_key:postKey
    })
  },

  onPostTap:function(event){
    var postId = event.currentTarget.dataset.postid;
   // var view = event.currentTarget.dataset.view; 
   //可以通过类似于获取postid的方法来获取，也可使用postData.postList[postId].view来获取
    // 事件（单击）-当前目标-数据（wxml里的data-）- postid
    //wxml中是data-postId，在此根据调试数据跟踪发现小程序会自动
    //将data-后面字符串变为小写并去除连字符。
    //实现阅读人数++？？？？？
    var view = this.data.post_key[postId].view;
    view ++;
    this.data.post_key[postId].view = view;
    //页面跳转
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  }
})