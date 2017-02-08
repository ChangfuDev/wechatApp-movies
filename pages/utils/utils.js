function starShow(average){
        //根据分数设置星星显示的个数
      // [1,1,1,0,0]
      var star = Math.round(average / 2);
      var starArray = [];
      for (var i = 1; i <= 5; i++) {
        if (i <= star) {
          starArray.push(1)
        } else {
          starArray.push(0)
        }
      }
    
      return starArray;
}

function getmoviesData(url,moviekey,movietype,callback) {
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'json'
      }, // 设置请求的 header
      success: function (res) {
        // success
        callback(res.data,moviekey,movietype);
      },
      fail: function () {
        // fail
      }
    })
  }


  
//传出参数
module.exports = {
    starShow: starShow,
    getmoviesData:getmoviesData
}