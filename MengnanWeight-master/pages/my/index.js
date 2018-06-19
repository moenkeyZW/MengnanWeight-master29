// pages/my/index.js
const app = getApp()
const ageArr = [], heightArr = [], weightArr = []

for (let i = 1; i < 101; i++) {
  ageArr.push(i)
}
for (let i = 50; i < 220; i++) {
  heightArr.push(i)
}
for (let i = 20; i < 160; i++) {
  weightArr.push(i)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: true,
    userInfo: {},
    genderArray: ['男', '女'],
    ageArr: ageArr,
    heightArr: heightArr,
    weightArr: weightArr,
    showLoading: false
  },

  // 下拉刷新
  onPullDownRefresh: function () {

    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad();// 刷新页面
    if (app.globalData.userInfo) {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    const userInfo = app.globalData.userInfo;
    this.setData({
      userInfo: userInfo
    })
    const hasUserInfo = null;
    if (userInfo) {
      this.setData({
        hasUserInfo: true,
      })
    } else {
      this.setData({
        hasUserInfo: false,
      })
    }
    //获取用户信息
    // var that = this;
    // if (!app.globalData.userInfo) {
    //   app.onRefresh(function (res) {
    //     that.setData({
    //       userInfo: app.globalData.userInfo,
    //     })
    //   });
    // } else {
    //   const userInfo = app.globalData.userInfo;
    //   this.setData({
    //     userInfo: userInfo
    //   })
    // }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (!app.globalData.userInfo) {
      // wx.showLoading({
      //   title: '加载中...',
      // })
      app.onRefresh(function (res) {
        // wx.hideLoading()
        that.setData({
          userInfo: app.globalData.userInfo,
        })
      });
    } else {
      const userInfo = app.globalData.userInfo;
      this.setData({
        userInfo: userInfo
      })
    }

  },
  pickGender: function (e) {
    this.setData({
      [`userInfo.gender`]: Number.parseInt(e.detail.value)+1
    })
  },
  pickAge: function (e) {
    this.setData({
      [`age`]: Number.parseInt(e.detail.value) + 1
    })
  },
  saveHandle: function (e) {
    const _this = this
    let { gender, age} = e.detail.value
    let mes = ""
    if (gender === "") {
      mes = "性别"
      wx.showModal({
        title: '信息不完整',
        content: `${mes}未填写，请补充`,
        showCancel: false,
        confirmText: '知道了',
        success: function (res) {
        }
      })
      return
    }
    if (age === "") {
      mes = "年龄"
      wx.showModal({
        title: '信息不完整',
        content: `${mes}未填写，请补充`,
        showCancel: false,
        confirmText: '知道了',
        success: function (res) {
        }
      })
      return
    }
    gender = gender === '男'? 1: 2
    this.setData({
      showLoading: true
    }, ()=> {
      // 调用保存用户信息api
      wx.request({
        url: app.globalData.base_url +'index.php/wechat/save_info/',
        data: {
          gender: gender,
          age: age,
          openid: wx.getStorageSync('openid')
        },
        success: function (res) {
          if (res.statusCode === 200) {
            app.globalData.userInfo.gender = gender,
            app.globalData.userInfo.age = age,
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1500,
              mask: true,
              success: () => {
                wx.navigateTo({
                  url: '/pages/index/index',
                })
                app.onRefresh();
                _this.setData({
                  showLoading: false,
                  
                })
              }
            })
          }
        }

      })
    })
  },

})