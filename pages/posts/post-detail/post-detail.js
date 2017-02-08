// pages/posts/post-detail/post-detail.js
var postData = require('../../../data/post_data.js')
var app = getApp();
Page({
  data: {
    isPlaymusic: false
  },
  onLoad: function (options) {
    var global_isPlaymusic = app.globalData.global_isPlaymusic;
    var PlaymusicId = app.globalData.PlaymusicId;
    var postId = options.id;
    this.setData({
      currentPostId: postId
    })
    var postdata = postData.postList[postId];
    var artTitle = postData.postList[postId].title;
    this.setData({
      postdata: postdata,
      artTitle: artTitle
    })
    // 页面初始化 options为页面跳转所带来的参数

    // wx.setStorageSync('stroage', {
    // 0:false,
    // 1:false,
    // 2:false
    // })
    //获取收藏缓存对象
    var postcollected = wx.getStorageSync('stroage');
    if (postcollected) {
      var collected = postcollected[postId];
      this.setData({
        collected: collected
      })

    }
    else {
      var postcollected = {};
      postcollected[postId] = false;
      wx.setStorageSync('stroage', postcollected);
    }
    //判断正在播放的音乐是否为本页面的因为因为
    //若是则图标变为正在播放图标
    if(global_isPlaymusic && PlaymusicId === postId){
      this.setData({
        isPlaymusic:true
      })
    }
    this.setMusicMonitor();
  },
//音乐监听函数
  setMusicMonitor:function(){
    var that = this;
    //监听播放
    wx.onBackgroundAudioPlay(function(){
       that.setData({
         isPlaymusic:true
       })
       app.globalData.global_isPlaymusic = true;
       app.globalData.PlaymusicId = that.data.currentPostId;
    })
    //监听暂停
    wx.onBackgroundAudioPause(function(){
      that.setData({
        isPlaymusic:false
      })
       app.globalData.global_isPlaymusic = false;
       app.globalData.PlaymusicId = null;
    })
    //监听停止
    wx.onBackgroundAudioStop(function(){
      that.setData({
        isPlaymusic:false
      })
       app.globalData.global_isPlaymusic = false;
       app.globalData.PlaymusicId = null;
    })
  },
  onCash: function () {
    this.onPostcollectedSync();
    //  this.onPostcollectedAsy();
    //交互反馈信息

  },
  //异步缓存，在小程序中，能用同步就尽量不用异步，异步不易维护
  onPostcollectedAsy: function () {
    var that = this;
    wx.getStorage({
      key: 'stroage',
      success: function (res) {
        // success
        var postcollected = res.data;
        var collected = postcollected[that.data.currentPostId];
        collected = !collected;
        postcollected[that.data.currentPostId] = collected;
        wx.setStorageSync('stroage', postcollected);
        that.setData({
          collected: collected
        })
        wx.showToast({
          title: collected ? "收藏成功" : "取消收藏",
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  //同步缓存
  onPostcollectedSync: function () {
    //获取缓存对象
    //从缓存对象中获取对应ID的值
    //取反
    //更新缓存中该ID的值
    //更新缓存对象
    var postcollected = wx.getStorageSync('stroage');
    var collected = postcollected[this.data.currentPostId];
    collected = !collected;
    postcollected[this.data.currentPostId] = collected;
    wx.setStorageSync('stroage', postcollected);
    this.setData({
      collected: collected
    })
    wx.showToast({
      title: collected ? "收藏成功" : "取消收藏",
      icon: 'success',
      duration: 1000
    })
  },
  onShareAppMessage: function () {
    return {
      title: '分享给好友',
      desc: '详情页',
      path: '/page/user?id=123'
    }
  },
  onShare: function () {
    wx.showActionSheet({
      itemList: ['分享给好友'],
      success: function (res) {
        wx.showModal({
          title: '分享给好友',
          content: '详情页',
          success: function (res) {
            if (res.confirm) {
              wx.showToast({
                title: '分享成功',
                icon: 'success',
                duration: 1000
              })
            }
          }
        })
      }
    })
  },
  onMusic: function (event) {
    //music url 本地地址不可用
    var isPlaymusic = this.data.isPlaymusic;
    var currentId = this.data.currentPostId;
    var data = postData.postList[currentId].music;
    if (isPlaymusic) {
      wx.pauseBackgroundAudio()
      this.setData({
        isPlaymusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: data.dataUrl,
        title: data.title,
        coverImgUrl: data.coverImgUrl
      })
      this.setData({
        isPlaymusic: true
      })
    }

  },
  onShow:function(event){
     wx.setNavigationBarTitle({
      title: this.data.artTitle,
    })
  }


})