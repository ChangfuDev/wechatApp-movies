// pages/movies/movie.js
var utils = require("../utils/utils.js");
var app = getApp();
Page({
  data: {
    intheaters: {},
    comingsoon: {},
    top250: {},
    searchResult:{},
    popuSearch:{},
    searchValue:'',
    MlistShow:true,
    MSearchShow:false,
    focus:false

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var intheaters = app.globalData.doubanbase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingsoon = app.globalData.doubanbase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250 = app.globalData.doubanbase + "/v2/movie/top250" + "?start=0&count=3";

    utils.getmoviesData(intheaters, "intheaters","正在热映",this.processDoubanData);
    utils.getmoviesData(comingsoon, "comingsoon","即将上映",this.processDoubanData);
    utils.getmoviesData(top250, "top250","豆瓣top250",this.processDoubanData);

   
  },
  moreTap:function(event){
      var type = event.currentTarget.dataset.type;
    wx.navigateTo({
      url: 'movieType/movieType?Type='+ type,
    })
  },
  
  searchFocusTap:function(){
    this.setData({
      MlistShow:false,
      MSearchShow:true,
      focus:true
    })
    var isShow = this.data.MSearchShow;
    var searchUrl = this.data.searchValue;
    if (isShow && searchUrl=="") {
      console.log("调用缓存中的历史纪录");
    }
  },
  searchCloseTap:function(e){
    this.setData({
      MlistShow:true,
      MSearchShow:false,
      focus:false,
    })
  },

  searchConfirmTap:function(e){
    var searchUrl = e.detail.value;
    if (searchUrl != "") {
      this.setData({
        searchValue:e.detail.value
      })
      var text = this.data.searchValue;
      var searchUrl =  app.globalData.doubanbase + "/v2/movie/search?q=" + text;
      utils.getmoviesData(searchUrl, "searchResult","",this.processDoubanData);
    }
  },
  tapToDeatail:function(event){
    var movieId = event.currentTarget.dataset.movieid;
    console.log(movieId);
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    })
  },
  processDoubanData: function (DoubanMovies, moviekey,movietype) {
    var movie = [];
    // var listTitle = DoubanMovies.title;
    var listTitle = movietype;
    for (var ids in DoubanMovies.subjects) {
      var movieId = DoubanMovies.subjects[ids].id;
      var movieImg = DoubanMovies.subjects[ids].images.large;
      var average = DoubanMovies.subjects[ids].rating.average;
      var title = DoubanMovies.subjects[ids].title;

      //设置标题显示字数
      if (title.length >= 6) {
        title = title.substring(0, 5) + "..."
      }
      
      var tem = {
        movie_Id: movieId,
        movie_Img: movieImg,
        title: title,
        average: average,
        starArray: utils.starShow(average)
      }
      movie.push(tem);
      var Mkey = {};
      Mkey[moviekey] = {
        movies: movie,
        listTitle: listTitle
      };
    }
    this.setData(Mkey);
      var popuSearch = this.data.intheaters.movies[0].title;
      this.setData({
      popuSearch:popuSearch
      });
  },
  onShow: function (event) {
    //属于UI组件，应放在渲染步骤
    wx.setNavigationBarTitle({
      title: "电影"
    })
  }
})
