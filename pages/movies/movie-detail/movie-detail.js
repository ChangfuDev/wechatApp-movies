// pages/movies/movie-detail/movie-detail.js
var app = getApp();
var utils = require("../../utils/utils.js");
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var movieId = options.id;
    this.getMoviedetail(movieId);

  },
  getMoviedetail:function(movieId){
    var that = this;
    var detailUrl = app.globalData.doubanbase +"/v2/movie/subject/"+movieId;
    wx.request({
      url: detailUrl,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
          'content-type': 'json'
      }, 
      success: function(res){
        console.log(res);
        var data = res.data;
        
        var director = {
           avatar:"",
            name:"",
            id:""
        }
        if (data.directors[0] !==null){
          if (data.directors[0].avatars !==null){
            director.avatar = data.directors[0].avatars.large;
          }
          director.id = data.directors[0].id;
          director.name = data.directors[0].name;
        }
        var average = data.rating.average;
        var movie = {
          director:director,
          title:data.title,
          originalTitle:data.original_title,
          movieImg:data.images.small,
          country:data.countries[0],
          year: data.year,
          wishCount:data.wish_count,
          commentCount:data.comments_count,
          summary:data.summary,
          average: average,
          starArray: utils.starShow(average),
          generes:data.genres.join("、"),
          castsInfo: that.getCasts(data.casts),
          casts:that.getCastsName(data.casts).join("/")
        }
        console.log(movie);
        that.setData({
          movie:movie
        })
      }
    })
  },
  getCasts:function(e){
    var castsInfo = [];
    for (var i in e) {
      var item = {
        img:e[i].avatars.small,
        name:e[i].name
      }
      castsInfo.push(item);      
    }
    
    return castsInfo;
  },
  getCastsName:function(e){
    var name = [];
    for (var i in e){
      name.push(e[i].name);
    }
    return name;
  },
    onShow: function (event) {
    //属于UI组件，应放在渲染步骤
    wx.setNavigationBarTitle({
      title: "电影详情"
    })
  }
})