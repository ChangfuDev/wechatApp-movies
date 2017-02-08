// pages/movies/movieType/movieType.js
var utils = require("../../utils/utils.js");
var app = getApp();
Page({
  data: {
    isEmpty: true,
    totalCount: 0
  },
  onLoad: function (options) {
    var type = options.Type;
    this.setData({
      type: type
    })
    //判断“更多”的类属
    switch (type) {
      case "正在热映":
        var dataUrl = app.globalData.doubanbase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        var dataUrl = app.globalData.doubanbase + "/v2/movie/coming_soon";
        break;
      case "豆瓣top250":
        var dataUrl = app.globalData.doubanbase + "/v2/movie/top250";
        break;
    }
    utils.getmoviesData(dataUrl, "moviekey", "movietype", this.processDoubanData);

    this.data.baseUrl = dataUrl;
  },
  //底部上滑加载更多
  onReachBottom: function (e) {
    var scrollUrl = this.data.baseUrl + "?start=" + this.data.totalCount + "&count=20";
    utils.getmoviesData(scrollUrl, "moviekey", "movietype", this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  //将从豆瓣获取的数据进行处理并加入data中
  processDoubanData: function (DoubanMovies, moviekey, movietype) {
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
      //将tem对象推入数组中
      movie.push(tem);
    }
    //底部上滑加载更多的数据处理
    var totalMovie = [];
    if (!this.data.isEmpty) {
      totalMovie = this.data.movies.concat(movie); //concat()向数组里边追加数组
    } else {
      totalMovie = movie;
      this.data.isEmpty = false;
    }
    var Mkey = {};
    Mkey = {
      movies: totalMovie,
      listTitle: listTitle,
    };
    this.setData(Mkey);
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
  },
  tapToDeatail: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    console.log(movieId);
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },
  onShow: function (event) {
    //属于UI组件，应放在渲染步骤
    wx.setNavigationBarTitle({
      title: this.data.type,
    })
  }
})