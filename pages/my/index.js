// pages/my/index.js
const app = getApp()
const ageArr = [];
for (let i = 0; i < 101; i++) {
  ageArr.push(i)
}
const heightArr = [];
for (let j = 0; j < 200; j++) {

  heightArr.push(j);

}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    genderArray: ['男', '女'],
    ageArr: ageArr,
    heightArr: heightArr,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  pickGender: function (e) {
    this.setData({
      [`userInfo.gender`]: Number.parseInt(e.detail.value) + 1
    })
  },
  pickAge: function (e) {
    const val = e.detail.value
    this.setData({
      [`userInfo.age`]: e.detail.value
    })
  },
  pickHeight: function (e) {
    const val = e.detail.value;
    //console.log(val);
    this.setData({
      [`userInfo.height`]: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // wx.request({
    //   url: ,
    // })
  },
  saveHandle: function (e) {
    console.log(e.detail.value)
  }
})