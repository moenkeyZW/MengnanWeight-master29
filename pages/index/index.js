//index.js
//获取应用实例
const app = getApp()
const ageArr = [];
for (let i = 0; i < 101; i++) {
  ageArr.push(i)
}
const heightArr = [];
for (let j = 0; j < 200; j++) {
  heightArr.push(j);
}
const weightArr = [];
for (let i=0;i<150;i++){
  weightArr.push(i);
}

Page({
  data: {
    userInfo: {},
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    genderArray: ['男', '女'],
    ageArr: ageArr,
    heightArr:heightArr,
    weightArr:weightArr,
    isOpenWXRun: false,
    stepRecord: {
      count: 1700,
      calorie: 12
    },
    weightRecord: {
      count: 12000,
      calorie: 1200
    },
   isShowGender:'block',
   isShowAge:'block',
   isShowStep:'none',
  },
  onLoad: function () {
    //判断是否有用户信息显示不同的模块
    if (wx.getUserInfo({
      withCredentials: true,
      lang: '',
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {

      },
      complete: function (res) {},
    }))

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
    // const isOpenWXRun = app.globalData.isOpenWXRun
    // if (isOpenWXRun === null) {
    //   app.isOpenWXRunReadyCallback = res => {
    //     this.setData({
    //       isOpenWXRun: res.isOpenWXRun
    //     })
    //   }
    // }
    // this.setData({
    //   isOpenWXRun: isOpenWXRun
    // }, () => {
    //   if (isOpenWXRun) {
    //     this.getRecords()
    //   } else {
    //     this.getWXRun()
    //     this.getWeightRecord()
    //   }
    // })

    // 调用步数记录和体重记录
  },
  // 获取步数记录和体重记录
  getRecords: function () {
    this.getStepRecord()
    this.getWeightRecord()
  },
  getStepRecord: function () {
    this.setData({
      stepRecord: {
        count: 1700,
        calorie: 12
      }
    })
  },
  getWeightRecord: function () {
    this.setData({
      weightRecord: {
        count: 12000,
        calorie: 1200
      }
    })
  },
  analyzeHandle: function (e) {
    const { gender, age, height, weight } = e.detail.value
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
    if (weight === "") {
      mes = "体重"
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
    const val = e.detail.value
    this.setData({
      [`userInfo.height`]: e.detail.value
    })
  },
  pickWeight: function (e) {
    const val = e.detail.value
    this.setData({
      [`userInfo.weight`]: e.detail.value
    })
  },
  // 获取微信运动权限
  getWXRun: function (e) {
    wx.getWeRunData({
      success(res) {
        const encryptedData = res.encryptedData
        console.log(res)
      }
    })
  },
  openStepRecord: function () {
    wx.navigateTo({
      url: '/pages/step/index',
    })
  },
  openWeightRecord: function () {
    wx.navigateTo({
      url: '/pages/weight/index',
    })
  }


})
