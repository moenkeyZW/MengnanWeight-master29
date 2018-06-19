// pages/login/index.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  onLoad: function (options) {
    const that=this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(1, res);
              if (res) {
                wx.switchTab({
                  url: '/pages/index/index',
                })
              } else {
                that.setData({
                  'haveFullUserInfo': true
                })
              }
            }
          })
        }
      }
    })
  },


  bindGetUserInfo: function (e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else {
      wx.switchTab({
        url: '/pages/login/index',
      })
    }
  },
  // reAuthorize: function (e) {
  //   app.toAuthorize(function (res) {
  //     wx.switchTab({
  //       url: '/pages/index/index',
  //     })
  //   });
  // },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;
    if (!wx.getStorageSync('openid')) {
      wx.showLoading({
        title: '授权中',
      })
      app.onLogin(function (res) {
        wx.hideLoading();
        if (res) {
          wx.switchTab({
            url: '/pages/index/index',
          })
        } else {
          that.setData({
            'haveFullUserInfo': true
          })
        }
      });
    } else {
      wx.showLoading({
        title: '正在获取中',
      })
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },
})