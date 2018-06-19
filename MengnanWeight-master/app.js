//app.js
App({
  onLaunch: function (options) {
    // const updateManager = wx.getUpdateManager()
    // updateManager.onCheckForUpdate(function (res) {
    //   // 请求完新版本信息的回调
    //   console.log(res.hasUpdate)
    // })

    // updateManager.onUpdateReady(function () {
    //   wx.showModal({
    //     title: '更新提示',
    //     content: '新版本已经准备好，是否重启应用？',
    //     success: function (res) {
    //       if (res.confirm) {
    //         // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    //         updateManager.applyUpdate()
    //       }
    //     }
    //   })

    // })

    // updateManager.onUpdateFailed(function () {
    //   // 新的版本下载失败
    //  throw Error("新的版本下载失败");
    // })

    // this.globalData.scene = options.scene;
  },
  onShow: function (options) {
    this.globalData.scene = options.scene;
  },
  onRun: function (cb) {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.werun']) {
          that.globalData.isOpenWXRun = false;
        } else {
          if (!wx.getStorageSync('session')) {
            that.globalData.isOpenWXRun = false;
          } else {
            wx.getWeRunData({
              success(res) {
                wx.request({
                  url: that.globalData.base_url + 'index.php/wechat/wxrun/1/',
                  data: {
                    encryptedData: encodeURIComponent(res.encryptedData),
                    iv: encodeURIComponent(res.iv),
                    session: wx.getStorageSync('session')
                  },
                  method: 'GET',
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    if (res.data.status == 1) {
                      that.globalData.isOpenWXRun = true;
                      that.globalData.wxRunData = res.data;
                      typeof cb == "function" && cb(res.data);
                    } else {
                      that.globalData.isOpenWXRun = false;
                      wx.login({
                        success: res => {
                          wx.getUserInfo({
                            withCredentials: true,
                            success: function (res_user) {
                              wx.request({
                                url: that.globalData.base_url + 'index.php/wechat/login/',
                                data: {
                                  code: res.code,
                                  encryptedData: encodeURIComponent(res_user.encryptedData),
                                  iv: encodeURIComponent(res_user.iv)
                                },
                                method: 'GET',
                                header: {
                                  'content-type': 'application/json'
                                },
                                success: function (res) {
                                  that.globalData.userInfo = res.data.userinfo;
                                  wx.setStorageSync('session', res.data.hash);
                                  wx.setStorageSync('openid', res.data.openid);
                                  typeof cb == "function" && cb(that.globalData.userInfo)
                                  //that.onRun();
                                }
                              })
                            },
                          })

                        },

                      })
                    }
                  }
                })
              }
            })
          }
        }
      }
    })
  },
  onLogin: function (cb) {
    var that = this;
    wx.checkSession({
      success: function (res) {
        if (wx.getStorageSync('openid')) {
          that.onRefresh(cb);
        } else {
          wx.login({
            success: res => {
              if (res.code) {
                wx.getUserInfo({
                  withCredentials: true,
                  success: function (res_user) {
                    console.log(11,res_user)
                    wx.request({
                      url: that.globalData.base_url + 'index.php/wechat/login/',
                      data: {
                        code: res.code,
                        encryptedData: res_user.encryptedData,
                        iv:res_user.iv
                      },
                      method: 'GET',
                      header: {
                        'content-type': 'application/json'
                      },
                      success: function (res) {
                        console.log(3, res)
                        that.globalData.userInfo = res.data.userinfo;
                        wx.setStorageSync('session', res.data.hash);
                        wx.setStorageSync('openid', res.data.openid);
                        typeof cb == "function" && cb(that.globalData.userInfo)
                        //that.onRun();
                      }
                    })
                  },
                  fail: function (e) {
                    typeof cb == "function" && cb(false)
                    // wx.showModal({
                    //   title: '警告1',
                    //   content: '您拒绝了授权,将无法正常显示个人信息,点击确定重新获取授权。',
                    //   success: function (res) {
                    //     if (res.confirm) {
                    //       that.toAuthorize(cb);
                    //     } else if (res.cancel) {
                    //       typeof cb == "function" && cb(false)
                    //     }
                    //   }
                    // })
                  }
                })
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
              }
            },
            fail: function (e) {
              //  typeof cb == "function" && cb(false)
              //  wx.showModal({
              //    title: '警告',
              //    content: '您拒绝了授权,将无法正常显示个人信息,点击确定重新获取授权。',
              //    success: function (res) {
              //      if (res.confirm) {
              //        that.toAuthorize(cb);
              //      } else if (res.cancel) {
              //        typeof cb == "function" && cb(false)
              //      }
              //    }
              //  })
            }

          })
        }
      },
      fail: function () {
        wx.login({
          success: res => {
            if (res.code) {
              wx.getUserInfo({
                withCredentials: true,
                success: function (res_user) {
                  wx.request({
                    url: that.globalData.base_url + 'index.php/wechat/login/',
                    data: {
                      code: res.code,
                      encryptedData: res_user.encryptedData,
                      iv: res_user.iv
                    },
                    method: 'GET',
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      that.globalData.userInfo = res.data.userinfo;
                      wx.setStorageSync('session', res.data.hash);
                      wx.setStorageSync('openid', res.data.openid);
                      // that.onRun();
                      typeof cb == "function" && cb(that.globalData.userInfo)
                    }
                  })
                },
                fail: function (e) {
                  typeof cb == "function" && cb(false)
                  // wx.showModal({
                  //   title: '警告111111',
                  //   content: '您拒绝了授权,将无法正常显示个人信息,点击确定重新获取授权。',
                  //   success: function (res) {
                  //     if (res.confirm) {
                  //       that.toAuthorize(cb);
                  //     } else if (res.cancel){
                  //       typeof cb == "function" && cb(false)
                  //     }
                  //   }
                  // })
                }
              })
            } else {
              // typeof cb == "function" && cb(false)
              // wx.showModal({
              //   title: '警告',
              //   content: '您拒绝了授权,将无法正常显示个人信息,点击确定重新获取授权。',
              //   success: function (res) {
              //     if (res.confirm) {
              //       that.toAuthorize(cb);
              //     } else if (res.cancel) {
              //       typeof cb == "function" && cb(false)
              //     }
              //   }
              // })
            }
          }
        })
      }
    })
  },
  onRefresh: function (cb) {
    var that = this;
    wx.checkSession({
      success: function (res) {
        //that.onRun();
        if (!that.globalData.userInfo) {
          if (wx.getStorageSync('openid')) {
            wx.request({
              url: that.globalData.base_url + 'index.php/wechat/login_info/',
              data: {
                openid: wx.getStorageSync('openid'),
              },
              method: 'GET',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                that.globalData.userInfo = res.data.userinfo;
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
            })
          } else {
            that.onLogin(cb);
          }
        } else {
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      },
      fail: function (res) {
        that.onLogin(cb);
      },
    })

  },
  // toAuthorize: function (cb) {

  //   const that = this;
  //   wx.openSetting({
  //     success: (res) => {
  //       if (res.authSetting["scope.userInfo"]) {
  //         that.onLogin(cb);
  //       }
  //     }, fail: function (res) {

  //     }
  //   })


  // },
  onBmi: function (height, weight) {
    return (weight / ((height * height) / 10000)).toFixed(1);
  },
  onBf: function (height, weight, age, sex) {
    if (sex == 2) {
      sex = 0;
    }
    var bmi = (weight / ((height * height) / 10000)).toFixed(1);
    return (1.2 * bmi + 0.23 * age - 5.4 - 10.8 * sex).toFixed(1);
  },
  onBmr: function (height, weight, age, sex) {
    if (sex == 2) {
      sex = 0;
    }
    var bmr = null;
    if (sex === 0) {
      bmr = (655.1 + (9.56 * weight) + (1.85 * height) - (4.86 * age)).toFixed(1);
    } else {
      bmr = (66.5 + (13.7 * weight) + (5 * height) - (6.8 * age)).toFixed(1);
    }
    return bmr;
  },
  globalData: {
    base_url: "https://www.mnancheng.cn/",
    isOpenWXRun: null,
    wxRunData: null,
    userInfo: null,
    scene: null
  },
})