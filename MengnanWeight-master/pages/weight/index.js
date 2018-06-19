//index.js
//获取应用实例

const app = getApp()
const wxCharts = require('../../utils/wxcharts.js');
const da = new Date();
var year = da.getFullYear() + '年';
var month = da.getMonth() + 1 + '月';
const date = year + month;
const heightArr = [], weightArr = []
for (let i = 100; i < 220; i++) {
  heightArr.push(i)
}
for (let i = 20; i < 180; i++) {
  weightArr.push(i)
}

var lineChart = null;
var curveChart = null;

Page({
  data: {
    curIndex: 0,
    weightList: null,
    haveFullUserInfo: null,
    page: 1, // 页码
    date: date,
    flag:true,
    heightArr: heightArr,
    weightArr: weightArr,
    display:null,
    // startX: 0, //开始坐标
    // startY: 0,
  },
  touchHandler: function (e) {
    // console.log(e);
    lineChart.scrollStart(e);
  },
  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function (e) {
    // console.log(e)
    lineChart.scrollEnd(e);
    // lineChart.showToolTip(e, {
    //   format: function (item, category) {
    //     return category + ' ' + item.name + ':' + item.data
    //   }
    // });
  },
  touchHandlers: function (e) {
    curveChart.scrollStart(e);
  },
  moveHandlers: function (e) {
    curveChart.scroll(e);
  },
  touchEndHandlers: function (e) {
    curveChart.scrollEnd(e);
    // lineChart.showToolTip(e, {
    //   format: function (item, category) {
    //     return category + ' ' + item.name + ':' + item.data
    //   }
    // });
  },
  
  toggleDialog: function () {
    this.setData({
      flag: false,
      display:'none',
    })
  },
  /**
* 隐藏弹出窗口
*/
  hideHandle: function () {
    this.setData({
      flag: true,
      display:null,
    })
  },


  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onShow();// 刷新页面
    if (app.globalData.userInfo) {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新

    }
  },

  onLoad: function () {
    const _this = this;
    wx.request({
      url: app.globalData.base_url + 'index.php/wechat/get_weight_list/',
      data: {
        page: 1,
        openid: wx.getStorageSync('openid'),
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        _this.data.page = 1;
        _this.data.items = res.data.weightList;
        _this.setData({
          weightList: res.data.weightList,
          haveMore: res.data.more,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const _this = this;
    wx.request({
      url: app.globalData.base_url + 'index.php/wechat/get_weight/',
      data: {
        openid: wx.getStorageSync('openid'),
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        _this.drawCharts(res.data);
      }
    });
  },

  tabHandle: function (e) {
    const _this = this
    const index = e.target.dataset.index
    if (this.data.curIndex === index) return
    _this.setData({
      curIndex: index,
    }, () => {
      if (index === 0) {

      } else {
        //请求第一页体重记录
        wx.request({
          url: app.globalData.base_url + 'index.php/wechat/get_weight_list/',
          data: {
            page: 1,
            openid: wx.getStorageSync('openid'),
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            _this.data.page = 1;
            _this.data.items = res.data.weightList;
            _this.setData({
              weightList: res.data.weightList,
              haveMore: res.data.more,
            })
          }
        })
      }
    })
  },

  drawCharts: function (e) {
    //计算Y轴的范围
    const weightMin = Math.min.apply(Math, e.bmi);//取数组的最小值
    const weightMax = Math.max.apply(Math, e.bmi);//取数组的最大值
    const fatMin = Math.min.apply(Math, e.bfr);
    const fatMax = Math.max.apply(Math, e.bfr);
    const weightMid = (weightMax - weightMin) / 2;
    const fatMid = (fatMax - fatMin) / 2;
    const wYMax = weightMax + weightMid;
    const wYMin = weightMax - 5 * weightMid;
    const fYMax = fatMax + fatMid;
    const fYMin = fatMax - 5 * fatMid;
    // 计算偏移距离
    // var distance = -44.28571428571428;
    // if(e.date.length<=7){
    //   distance=0;
    // }else{
    //   distance*=(e.date.length-7);
    // }

    lineChart = new wxCharts({
      canvasId: 'weightChart',
      title: {
        name: '体重',
        fontSize: 12
      },
      type: 'line',
      categories: e.date,
      animation: false,
      background: '#ffffff',
      series: [{
        data: e.bmi,
        format: function (val, name) {
          return val;
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        format: function (val) {
          return Math.round(val);
        },
        min: wYMin,
        max: wYMax,
      },
      width: 350,
      height: 150,
      legend: false,
      dataLabel: true,
      dataPointShape: true,
      enableScroll: true,
      // _scrollDistance_: distance,
      extra: {
        lineStyle: 'line'
      }
    });

    curveChart = new wxCharts({
      canvasId: 'fatChart',
      title: {
        name: '体脂',
        fontSize: 12
      },
      type: 'line',
      categories: e.date,
      animation: false,
      background: '#ffffff',

      series: [{
        data: e.bfr,
        format: function (val, name) {
          return val;
        }

      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        format: function (val) {
          return Math.round(val);
        },
        min: fYMin,
        max: fYMax,
      },
      width: 350,
      height: 150,
      legend: false,
      dataLabel: true,
      dataPointShape: true,
      enableScroll: true,
      // _scrollDistance_: distance,
      extra: {
        lineStyle: 'line'
      }
    });
  },
  analyzeHandle: function (e) {
    const {gender,age} =e.detail.value;
    const height = Number.parseInt(e.detail.value.height) + 100;
    const weight = Number.parseInt(e.detail.value.weight) + 20;
    let mes = ""
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
      var that = this;
      wx.request({
        url: app.globalData.base_url + 'index.php/wechat/addinfo/',
        data: {
          gender: gender,
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
        flag: true,
        display: null,
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
  pickHeight: function (e) {
    this.setData({
      [`height`]: Number.parseInt(e.detail.value) + 100,
    })
  },
  pickWeight: function (e) {
    this.setData({
      [`weight`]: Number.parseInt(e.detail.value) + 20,
    })
  },
  // 上拉触底事件，请求记录数据
  onReachBottom: function () {
    if (this.data.curIndex === 1) return
    const _this = this
    let page = this.data.page
    if (this.data.haveMore) {
      // 请求下一页数据
      page++;
      _this.data.page = page;
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.base_url + 'index.php/wechat/get_weight_list/',
        data: {
          page: page,
          openid: wx.getStorageSync('openid'),
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading()
          _this.data.items = _this.data.items.concat(res.data.weightList);
          _this.setData({
            weightList: _this.data.items,
            haveMore: res.data.more,
          })
        }
      })
    } else {
      wx.showToast({
        title: '数据加载完毕',
        icon: 'success',
        duration: 1500,
      })
    }
  },
  openAnalysis: function (e) {
    const id = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/analysis/index?id=' + id,
    })
  },
  //删除单条记录
  deleteRecord: function (e) {
    const index = e.currentTarget.dataset.index
    const key = e.currentTarget.dataset.key
    var weightList = this.data.weightList
    const _this = this
    wx.showActionSheet({
      itemList: ['删除'],
      success: function (res) {
        if (res.tapIndex === 0) {
          wx.showLoading({
            title: '删除中...',
          })
          wx.request({
            url: app.globalData.base_url + 'index.php/wechat/del_info/',
            data: {
              id: index,
              openid: wx.getStorageSync('openid'),
            },
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              wx.hideLoading()
              weightList.splice(key, 1);
              _this.setData({
                weightList: weightList,
              })
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1500,
              })
            }
          })
        }
      }
    })
  },
})

