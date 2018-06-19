//index.js
//获取应用实例
const app = getApp();
//const wxCharts = require('../../utils/wxchartsMin.js');
const ageArr = [], heightArr = [], weightArr = []
for (let i = 1; i < 101; i++) {
  ageArr.push(i)
}
for (let i = 100; i < 220; i++) {
  heightArr.push(i)
}
for (let i = 20; i < 180; i++) {
  weightArr.push(i)
}

Page({
  data: {
    disabled: false,// 避免按钮多次点击重复出发事件
    haveRecord: null,
    isHaveShowRec: null,
    userInfo: {},
    hasUserInfo: true,
    genderArray: ['男', '女'],
    ageArr: ageArr,
    heightArr: heightArr,
    weightArr: weightArr,
    isOpenWXRun: false,
    isHaveGender: null,
    isHaveAge: null,
    flag: true,
    flagAge: true,
    stepRecord: {
      count: 0,
      calorie: 0
    },
    showRec: {  //首页显示的数据
      weight: '',
      height: '',
      bf: '',
      previousWeight: '',
      bmr: '',  // 基础代谢率
      hopeWeight: '',
      bmi: '',
      compare: '',
      status: '',
      id: '',
    },
    // record: { // 数据记录  称重进来
    //   weight: '',
    //   height: '',
    //   bf: '',
    //   previousWeight: '',
    //   bmr: '',  // 基础代谢率
    //   hopeWeight: '',
    //   bmi: '',
    //   compare: '',
    //   status: '',
    //   id: ''
    // }
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    // console.log(wx.getStorageSync('session'));
    this.onShow();// 刷新页面
    // if (app.globalData.userInfo) {
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    // }
  },

  onLoad: function (options) {

  },
  toggleDialog: function () {
    this.setData({
      flag: false,
    })
  },
  toggleDialogAge: function () {
    this.setData({
      flagAge: false,
    })
  },
  /**
 * 隐藏弹出窗口
 */
  hideHandle: function () {
    this.setData({
      flag: true,
      flagAge: true
    })
  },

  onShow: function () {
    var that = this;
    var userInfo = app.globalData.userInfo;
    that.setData({ disabled: false, })// 避免按钮多次点击重复出发事件
    if (!app.globalData.userInfo) {
      wx.showLoading({
        title: '加载中...',
      })
      app.onRefresh(function (res) {
        console.log(2,res)
        wx.hideLoading()
        that.setData({
          userInfo: app.globalData.userInfo,
          isOpenWXRun: app.globalData.isOpenWXRun
        }, () => {
          const userInfo = app.globalData.userInfo;
          that.onRet(userInfo);
        })
      });
    } else {
      that.setData({
        userInfo: app.globalData.userInfo,
        isOpenWXRun: app.globalData.isOpenWXRun
      }, () => {
        const userInfo = app.globalData.userInfo;
        that.onRet(userInfo);
      })
    }

  },
  // 获取微信运动权限
  getWXRun: function (e) {
    const that = this
    wx.getWeRunData({
      fail: function (rs) {
        wx.getSetting({
          success(r) {
            //console.log(r);
            wx.showModal({
              title: '提示',
              content: '微信运动授权失败，无法统计运动步数，请重新授权！',
              // showCancel: false,
              success: function (re) {
                if (re.confirm) {
                  // console.log('用户点击确定')
                  // 微信运动步数 提示授权
                  wx.openSetting({
                    success: (res) => {
                      if (res.authSetting['scope.werun']) {
                        app.onRun(function (res) {
                          that.setData({
                            isOpenWXRun: app.globalData.isOpenWXRun
                          })
                          that.getStepRecord(res.data);
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        })
      },
      success: function (res) {
        wx.getWeRunData({
          success(res) {
            app.onRun(function (res) {
              that.setData({
                isOpenWXRun: app.globalData.isOpenWXRun
              })
              wx.navigateTo({
                url: '/pages/step/index',
              })
              that.getStepRecord(res.data);
            })
          }
        });
      }
    })
  },

  // 获取步数记录和体重记录
  getRecords: function () {
    var that = this;
    that.getStepRecord()
  },
  getStepRecord: function (runData) {
    var that = this;
    //const session = wx.getStorageSync('session')
    //console.log(session);

    var runData = app.globalData.wxRunData;
    // if (runData.data.length>0){
    if (runData == '') {
      var count = 0;
      // console.log(runData)
    } else {
      var count = runData.data[0];
    }
    const calorie = (4.924 * 10.5 * that.data.userInfo.weight * (count / 90) / 1000).toFixed(0)
    that.setData({
      stepRecord: {
        count: count,
        calorie: calorie
      }
    })
  },

  analyzeHandle: function (e) {
    var gender = null;
    if (e.detail.value.gender) {
      gender = e.detail.value.gender
    } else if (app.globalData.userInfo.gender > 0) {
      gender = app.globalData.userInfo.gender;
    } else {
      gender = "";
    }
    let { age, height, weight } = e.detail.value;
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

    //判断用户是否授权
    // console.log('aaa');
    // console.log(app.globalData.userInfo);
    if (app.globalData.userInfo) {
      gender = Number.parseInt(gender);
      app.globalData.userInfo.gender = gender;
      const sex = gender === 1 ? '男' : '女';
      age = Number.parseInt(e.detail.value.age) + 1;
      height = Number.parseInt(e.detail.value.height) + 100;
      weight = Number.parseInt(e.detail.value.weight) + 20;
      var that = this;
      wx.request({
        url: app.globalData.base_url + 'index.php/wechat/addinfo/',
        data: {
          gender: sex,
          age: age,
          height: height,
          weight: weight,
          openid: wx.getStorageSync('openid'),
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (json) {
          app.onRefresh();
          wx.navigateTo({
            url: '/pages/analysis/index?id=' + json.data.id
          })
        }
      })
      that.setData({
        disabled: true,
        flag: true,
      });// 避免按钮多次点击重复出发事件
    } else {
      wx.showModal({
        title: '警告',
        content: '获取个人信息失败，无法生成报告，请重新授权!',
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                }
              }
            })
          }
        }
      })
    }
  },

  analyzeHandleAge: function (e) {
    var that = this;
    var gender = null;
    if (e.detail.value.gender) {
      gender = e.detail.value.gender
    } else if (app.globalData.userInfo.gender) {
      gender = app.globalData.userInfo.gender;
    } else {
      gender = "";
    }
    const age = Number.parseInt(e.detail.value.age) + 1;
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
    // if (height === "") {
    //   mes = "身高"
    //   wx.showModal({
    //     title: '信息不完整',
    //     content: `${mes}未填写，请补充`,
    //     showCancel: false,
    //     confirmText: '知道了',
    //     success: function (res) {
    //     }
    //   })
    //   return
    // }
    gender = Number.parseInt(gender);
    app.globalData.userInfo.gender = gender;
    const sex = gender === 1 ? '男' : '女';
    const id = that.data.showRec.id;
    wx.request({
      url: app.globalData.base_url + 'index.php/wechat/update_info/',
      data: {
        openid: wx.getStorageSync('openid'),
        id: id,
        age: age,
        gender: sex
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        app.onRefresh();
        wx.navigateTo({
          url: '/pages/analysis/index?id=' + id
        })
      }
    })
    that.setData({
      disabled: true,
      flagAge: true,
    });// 避免按钮多次点击重复出发事件

  },

  changGender: function (e) {
    this.setData({
      [`userInfo.gender`]: Number.parseInt(e.detail.value),
    })
  },
  pickAge: function (e) {
    this.setData({
      age: Number.parseInt(e.detail.value) + 1,
    })
  },

  pickHeight: function (e) {
    this.setData({
      height: Number.parseInt(e.detail.value) + 100,
    })
  },
  pickWeight: function (e) {
    this.setData({
      weight: Number.parseInt(e.detail.value) + 20,
    })
  },


  onRet: function (userInfo) {
    var that = this;
    app.onRun(function (res) {
      that.setData({
        isOpenWXRun: app.globalData.isOpenWXRun
      })
      if (res.data === "") {
        wx.showLoading({
          title: '加载中...',
        })
      } else {
        wx.hideLoading()
        that.getStepRecord(res.data);
      }
    })
    if (userInfo.gender > 0 && userInfo.age > 0) {
      that.setData({
        // 获取测量数据，若有haveRecord: true
        haveRecord: true
      })
    } else {
      that.setData({
        haveRecord: false
      })
    }

    this.setData({
      [`height`]: ""
    })
    this.setData({
      [`weight`]: ""
    })

    // 手动输入的，无称重记录
    wx.request({
      url: app.globalData.base_url + 'index.php/wechat/get_last_info2/',
      data: {
        openid: wx.getStorageSync('openid'),
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.status === 0) {
          console.log(res.data.msg);
        } else {
          var gender = userInfo.gender;
          if (userInfo.gender === 2) {
            gender = 0;
          } else {
            gender = 1;
          }
          var compare = null;
          if (res.data.prev.weight > 0) {
            if (res.data.userinfo.weight > res.data.prev.weight) {
              compare = (res.data.userinfo.weight - res.data.prev.weight).toFixed(1);
            } else {
              compare = (res.data.prev.weight - res.data.userinfo.weight).toFixed(1);
            }
          } else {
            res.data.prev.weight = null;
          }
          var hopeWeight = 0;
          if (gender === 0) {
            hopeWeight = (19 * ((res.data.userinfo.height * res.data.userinfo.height) / 10000)).toFixed(1);
          } else {
            hopeWeight = (22 * ((res.data.userinfo.height * res.data.userinfo.height) / 10000)).toFixed(1);
          }
          that.setData({
            'showRec.weight': res.data.userinfo.weight,
            'showRec.height': res.data.userinfo.height,
            'showRec.bmi': app.onBmi(res.data.userinfo.height, res.data.userinfo.weight),
            'showRec.bmr': app.onBmr(res.data.userinfo.height, res.data.userinfo.weight, userInfo.age, userInfo.gender),
            'showRec.bf': app.onBf(res.data.userinfo.height, res.data.userinfo.weight, userInfo.age, userInfo.gender),
            'showRec.previousWeight': res.data.prev.weight,
            'showRec.compare': compare,
            'showRec.hopeWeight': hopeWeight,
            'showRec.status': res.data.status,
            'showRec.id': res.data.userinfo.id,
            isHaveShowRec: true,
          })
        }
      },
    })

    // 称重进来的或有称重记录的。一直显示称重记录
    // wx.request({
    //   url: app.globalData.base_url + 'index.php/wechat/get_last_info/',
    //   data: {
    //     openid: wx.getStorageSync('openid')
    //   },
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     var gender = userInfo.gender;
    //     if (userInfo.gender === 2) {
    //       gender = 0;
    //     } else {
    //       gender = 1;
    //     }
    //     var compare = null;
    //     if (res.data.prev.weight > 0) {
    //       if (res.data.userinfo.weight > res.data.prev.weight) {
    //         compare = (res.data.userinfo.weight - res.data.prev.weight).toFixed(1);
    //       } else {
    //         compare = (res.data.prev.weight - res.data.userinfo.weight).toFixed(1);
    //       }
    //     } else {
    //       res.data.prev.weight = null;
    //     }
    //     var hopeWeight = 0;
    //     if (gender === 0) {
    //       hopeWeight = (19 * ((res.data.userinfo.height * res.data.userinfo.height) / 10000)).toFixed(1);
    //     } else {
    //       hopeWeight = (22 * ((res.data.userinfo.height * res.data.userinfo.height) / 10000)).toFixed(1);
    //     }

    //     that.setData({
    //       'record.weight': res.data.userinfo.weight,
    //       'record.height': res.data.userinfo.height,
    //       'record.id': res.data.userinfo.id,
    //       'record.bmi': app.onBmi(res.data.userinfo.height, res.data.userinfo.weight),
    //       'record.bmr': app.onBmr(res.data.userinfo.height, res.data.userinfo.weight, userInfo.age, userInfo.gender),
    //       'record.bf': app.onBf(res.data.userinfo.height, res.data.userinfo.weight, userInfo.age, userInfo.gender),
    //       'record.previousWeight': res.data.prev.weight,
    //       'record.compare': compare,
    //       'record.status': res.data.status,
    //       'record.hopeWeight': hopeWeight,
    //       isHaveShowRec: true,
    //     })
    //   }
    // })
  },
  openAnalysis: function (e) {
    if (app.globalData.userInfo.age > 0 && app.globalData.userInfo.gender > 0) {
      wx.request({
        url: app.globalData.base_url + 'index.php/wechat/get_last_info2/',
        data: {
          openid: wx.getStorageSync('openid'),
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var id = res.data.userinfo.id;
          wx.navigateTo({
            url: '/pages/analysis/index?id=' + id,
          })
        }
      })
    } else {
      wx.showModal({
        title: '信息不完整',
        content: `请点击下方按钮，完善信息`,
        showCancel: false,
        confirmText: '知道了',
        success: function (res) {
        }
      })
      return
    }
  },

  navigateToStep: function () {
    if (app.globalData.isOpenWXRun) {
      wx.navigateTo({
        url: '/pages/step/index',
      })
    } else {
      this.getWXRun();
    }
  },

  openWeightRecord: function () {
    wx.navigateTo({
      url: '/pages/weight/index',
    })
  },
  // getAuth: function () {
  //   wx.openSetting({
  //     success: (res) => {
  //       /*
  //        * res.authSetting = {
  //        *   "scope.userInfo": true,
  //        *   "scope.userLocation": true
  //        * }
  //        */
  //     }
  //   })
  // },
})
