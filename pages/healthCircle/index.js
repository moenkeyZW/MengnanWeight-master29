// pages/health/index.js
const app = getApp()
const ageArr = [];
for (let i = 0; i < 101; i++) {
  ageArr.push(i)
}
const heightArr = [];
for(let j=0;j<200;j++){
    heightArr.push(j);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:true,
    height:true,
    flag:true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    genderArray: ['男', '女'],
    ageArr: ageArr,
    heightArr:heightArr,
  },
  toggleDialog:function(){
    this.setData({flag:false})
  },
  
  /** 无需隐藏,继续跳转事件
  hide: function () {
    this.setData({ flag: true })
  },
  */
  
  analyzeHandle: function (e) {
    let { gender, age, height, weight } = e.detail.value
    age = 22, height = 180, weight = 70
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
    if (height === "") {
      mes = "身高"
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
   
    wx.navigateTo({
      url: '/pages/analysis/index',
    })
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
    const val = e.detail.value ;
    //console.log(val);
    this.setData({
      [`userInfo.height`]: e.detail.value 
    })
  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    if (app.globalData.userInfo.nickName !== '') {
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

  /**
   * 隐藏弹出窗口
   */
  hideHandle: function () {
    this.setData({
      flag: true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})