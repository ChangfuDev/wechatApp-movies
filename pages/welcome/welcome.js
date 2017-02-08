Page({
 toIndex: function(){
     console.log("调用toIndex方法");
   
   //仅跳转到含有tabbar的页面
     wx.switchTab({
       url: '/pages/posts/post'
     })
     
 },
 onHide:function(){
     console.log("onHide");
    // 页面隐藏
  },
  onUnload:function(){
     console.log("onUnload");
    // 页面关闭
  }
})