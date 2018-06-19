//index.js
//获取应用实例
const app = getApp()
const wxCharts = require('../../utils/wxcharts.js');
// var chartData = wx.getStorageSync('wxRunData');
const today = (new Date()).toLocaleDateString() + " " + (new Date()).toLocaleTimeString();
var lineChart = null;
const stepArr = [];
for (let i = 1000; i < 40000; i += 1000) {
  stepArr.push(i)
}
Page({
  data: {
    curIndex: 0,
    stepData: null,
    userInfo: {},
    showChangeGoalModal: true,
    today: today,
    stepArr: stepArr
  },
  touchHandler: function (e) {
    lineChart.scrollStart(e);
  },
  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function (e) {
    lineChart.scrollEnd(e);
    // lineChart.showToolTip(e, {
    //   format: function (item, category) {
    //     return category + ' ' + item.name + ':' + item.data
    //   }
    // });
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

  onLoad: function (options) {

  },
  onShow: function () {
    const chartData = app.globalData.wxRunData;
    if (!(chartData < 0) && chartData != undefined) {
      var stepData = {
        count: chartData[chartData.data.length - 1],
        goal: 8888,
        distance: 0.9,
        gas: 0.07,
        calorie: 12,
        fat: 10,
        oxygen: '',
      }
      const userInfo = app.globalData.userInfo;
      if (app.globalData.userInfo.goal > 0) {
        stepData.goal = app.globalData.userInfo.goal;
      } else {
        stepData.goal = stepData.goal;
      }
      if (chartData.data.length > 0) {
        stepData.count = chartData.data[0];
      } else {
        stepData.count = 0;
      }
      //  耗氧量（ml）=3(MET 梅脱) * 3.5（ml / kg / min 每分钟耗氧指数）*XX（kg体重）*X（min分钟）（分钟 = 总步数 / 90（步 / 分钟））
      //  消耗能量（Kcal）=4.924kcal（固定指数）*耗氧量（L注意换算）
      const gas = (stepData.count / 0.7 * 0.00008).toFixed(1);
      const oxygen = (3 * 3.5 * userInfo.weight * (stepData.count / 90)) / 1000;
      const calorie = (4.924 * oxygen).toFixed(0);
      const fat = (calorie / 9.3).toFixed(0);
      const distance = ((stepData.count * 0.7) / 1000).toFixed(1);

      this.setData({
        stepData: stepData,
        'stepData.gas': gas,
        'stepData.calorie': calorie,
        'stepData.fat': fat,
        'stepData.distance': distance,
      })
    } else {
      app.onRun(function (res) {

      })
    }
    
    const stepMax = Math.max.apply(Math, chartData.data);//取数组的最大值
    const sYMax = stepMax * 1.1;
    if (this.data.curIndex === 0) {
      lineChart = new wxCharts({
        canvasId: 'stepChart',
        type: 'column',
        animation: true,
        categories: chartData.categories,
        series: [{
          name: chartData.title,
          data: chartData.data,
          format: function (val, name) {
            return val;
          }
        }],
        yAxis: {
          disabled: true,
          min: 0,
          max: sYMax,
        },
        xAxis: {
          disableGrid: false,
          type: 'calibration'
        },
        enableScroll: true,
        // _scrollDistance_:-1203.4285714285716,
        extra: {
          column: {
            width: 15
          }
        },
        width: 375,
        height: 400,
      });
    }

  },

  tabHandle: function (e) {
    const index = e.target.dataset.index || e.currentTarget.dataset.index
    if (this.data.curIndex === index) return
    this.setData({
      curIndex: index
    }, () => {
    
    })

  },
  showGoalModal: function () {
    this.setData({
      showChangeGoalModal: false
    })
  },
  inputStep: function (e) {
    if (e.detail.value === '') return
    this.setData({
      goal: e.detail.value
    })
  },
  // 点击确定修改目标步数
  confirm: function () {
    console.log(this.data.goal);
    const goal = this.data.goal;
    wx.request({
      url: app.globalData.base_url + 'index.php/wechat/save_goal/',
      data: {
        goal: goal,
        openid: wx.getStorageSync('openid')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        app.globalData.userInfo.goal = parseInt(goal);
      }
    })
    this.setData({
      showChangeGoalModal: true,
      'stepData.goal': this.data.goal
    })

  },
  // 取消
  cancel: function () {
    this.setData({
      showChangeGoalModal: true
    })
  },
  pickStep: function (e) {
    const goal = (Number.parseInt(e.detail.value) + 1) * 1000
    this.setData({
      [`userInfo.goal`]: goal,
      [`stepData.goal`]: goal
    }, () => {
      wx.request({
        url: app.globalData.base_url + 'index.php/wechat/save_goal/',
        data: {
          goal: goal,
          openid: wx.getStorageSync('openid')
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          app.globalData.userInfo.goal = parseInt(goal);
        }
      })
    })
  }
})
