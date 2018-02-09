//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 从数据库获取用户信息
    // wx.request({
    //   url: 'url',
    // })
    const userInfo = {
      avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erekDB6XxBgEYiboFFdDETibQKTQhrxEOmy0Fwq3c2WaqBvD2xMv2Lah8bsJavdkk3sNJrUeryA0Tbw/0',
      gender: 1,
      nickName: '枫',
      age: 22,
      height: 178,
      weight: 70
    }
    this.globalData.userInfo = userInfo
    if (userInfo.nickName !== '') {
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
          this.globalData.isOpenWXRun = res.authSetting['scope.werun']? true: false
          console.log(this.globalData.isOpenWXRun)
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    isOpenWXRun: null
  }
  // userInfoReadyCallback: function (userInfo) {
  //   this.globalData.userInfo = userInfo
  // }
})