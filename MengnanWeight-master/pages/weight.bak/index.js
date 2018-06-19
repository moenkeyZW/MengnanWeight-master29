//index.js
//获取应用实例

const app = getApp()
const wxCharts = require('../../utils/wxcharts.js');
const da = new Date();
var year = da.getFullYear() + '年';
var month = da.getMonth() + 1 + '月';
var day = da.getDate();
var week= da.getDay();
var hour= da.getHours();
var minute= da.getMinutes();
const time= hour+':'+minute;

switch (week) {
  case 0: week = "星期天"; break;
  case 1: week = "星期一"; break;
  case 2: week = "星期二"; break;
  case 3: week = "星期三"; break;
  case 4: week = "星期四"; break;
  case 5: week = "星期五"; break;
  case 6: week = "星期六"; break;
}
const date=year+month;
const weightDate=year+month+day+'日'+' '+week;

const chartsData={
  mainData:{
    weightData:[65,75,56,69,50,65,60,58,65,],
    fatData: [21.2, 22.1, 21.3, 21.4, 21.5, 22.2, 21.6, 21.0, 20.8, 21.3],
  }
};
const weightMin = Math.min.apply(Math, chartsData.mainData.weightData);
const weightMax = Math.max.apply(Math, chartsData.mainData.weightData);
const fatMin = Math.min.apply(Math, chartsData.mainData.fatData);
const fatMax = Math.max.apply(Math, chartsData.mainData.fatData);
const weightMid=(weightMax-weightMin)/2;
const fatMid = (fatMax-fatMin) / 2;
const wYMax=weightMax+weightMid;
const wYMin=weightMax-5*weightMid;
const fYMax=fatMax+fatMid;
const fYMin=fatMax-5*fatMid;

var lineChart = null;
var curveChart = null;

Page({
  data: {
    curIndex: 1,
    weightList: null,
    page: 1, // 页码
    date:date,
    // items: [],
    // startX: 0, //开始坐标
    // startY: 0,
  },
  touchHandler: function (e) {
    lineChart.scrollStart(e);
    console.log(e);
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
  onLoad: function () {
    // 获取用户信息
    const userInfo = {
      avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erekDB6XxBgEYiboFFdDETibQKTQhrxEOmy0Fwq3c2WaqBvD2xMv2Lah8bsJavdkk3sNJrUeryA0Tbw/0',
      gender: 1,
      nickName: '枫',
      age: 24,
      height: 160,
      weight: 52,
    }
    const bmi = (userInfo.weight / ((userInfo.height * userInfo.height) / 10000)).toFixed(1);
    this.drawCharts()
    this.setData({
      weightList: [
        {
          date: weightDate,
          time: time,
          weight: userInfo.weight,
          bmi: bmi
        },
        {
          date: '2018年1月16日  星期二',
          time: '08:03',
          weight: 20,
          bmi: 22
        },
        {
          date: '2018年1月16日  星期二',
          time: '08:03',
          weight: 30,
          bmi: 22
        },
        {
          date: '2018年1月16日  星期二',
          time: '08:03',
          weight: 20,
          bmi: 22
        },
        {
          date: '2018年1月16日  星期二',
          time: '08:03',
          weight: 30,
          bmi: 22
        },
        {
          date: '2018年1月16日  星期二',
          time: '08:03',
          weight: 20,
          bmi: 22
        },
        {
          date: '2018年1月16日  星期二',
          time: '08:03',
          weight: 30,
          bmi: 22
        },
        {
          date: '2018年1月16日  星期二',
          time: '08:03',
          weight: 20,
          bmi: 22
        },
        {
          date: '2018年1月16日  星期二',
          time: '08:03',
          weight: 30,
          bmi: 22
        },
        {
          date: '2018年1月16日  星期二',
          time: '08:03',
          weight: 40,
          bmi: 22
        }
      ],
      haveMore: true
    })

  },
  tabHandle: function (e) {
    const _this = this
    const index = e.target.dataset.index
    if (this.data.curIndex === index) return
    _this.setData({
      curIndex: index
    }, () => {
      if (index === 0) {

      } else {
        // 请求第一页体重记录
        // _this.setData({
        //   weightList: [
        //     {
        //       date: '2018年1月16日  星期二',
        //       time: '08:03',
        //       weight: 10,
        //       bmi: 22
        //     },
        //     {
        //       date: '2018年1月16日  星期二',
        //       time: '08:03',
        //       weight: 20,
        //       bmi: 22
        //     },
        //     {
        //       date: '2018年1月16日  星期二',
        //       time: '08:03',
        //       weight: 30,
        //       bmi: 22
        //     },
        //     {
        //       date: '2018年1月16日  星期二',
        //       time: '08:03',
        //       weight: 20,
        //       bmi: 22
        //     },
            /*
            {
              date: '2018年1月16日  星期二',
              time: '08:03',
              weight: 30,
              bmi: 22
            },
            {
              date: '2018年1月16日  星期二',
              time: '08:03',
              weight: 20,
              bmi: 22
            },
            {
              date: '2018年1月16日  星期二',
              time: '08:03',
              weight: 30,
              bmi: 22
            },
            {
              date: '2018年1月16日  星期二',
              time: '08:03',
              weight: 20,
              bmi: 22
            },
            {
              date: '2018年1月16日  星期二',
              time: '08:03',
              weight: 30,
              bmi: 22
            },
            {
              date: '2018年1月16日  星期二',
              time: '08:03',
              weight: 40,
              bmi: 22
            }
            */
            
      //     ],
      //     haveMore: true,
      //   })
      }
    })
  },

  drawCharts: function () {
    lineChart=new wxCharts({
      canvasId: 'weightChart',
      title: {
        name: '体重',
        fontSize: 12
      },     
      type: 'line',
      //push用户每次测量称重的当天日期day。
      categories: [2,3,4,5,6,7,8,9,10],
      animation: true,
      background: '#ffffff',
      series: [{
        data: chartsData.mainData.weightData,
        color: '#19b4f2',
        format: function (val, name) {
          return val;
        },
      }
      ], 

      xAxis: {
        disableGrid: true,
       
      },
      yAxis: {
        format: function (val) {
          return val.toFixed(0);
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
      extra: {
        lineStyle: 'line'
      }
    });

    curveChart=new wxCharts({
      canvasId: 'fatChart',
      title: {
        name: '体脂',
        fontSize: 12
      },
      type: 'line',
      categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 体脂数组数组长度，从第一次开始
      animation: true,
      background: '#ffffff',
      series: [{
        data: chartsData.mainData.fatData,
        color: '#19b4f2',
        format: function (val, name) {
          return val;
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        format: function (val) {
          return val.toFixed(0);
        },
        min:fYMin,
        max:fYMax,
      },
      width: 350,
      height: 150,
      legend: false,
      dataLabel: true,
      dataPointShape: true,
      enableScroll: true,
      extra: {
        lineStyle: 'line'
      }
    });
  },
  // 上拉触底事件，请求记录数据
  onReachBottom: function () {
    if (this.data.curIndex === 0) return
    const _this = this
    let page = this.data.page
    if(this.data.haveMore) {
      // 请求下一页数据
      page ++
      // 请求到的数据
      const weightList = [
        {
          date: '2018年1月16日  星期二',
          time: '08:03',
          weight: 20,
          bmi: 22
        },
        {
          date: '2018年1月16日  星期二',
          time: '08:03',
          weight: 20,
          bmi: 22
        },
        {
          date: '2018年1月16日  星期二',
          time: '08:03',
          weight: 30,
          bmi: 22
        },
        {
          date: '2018年1月16日  星期二',
          time: '08:03',
          weight: 30,
          bmi: 22
        }
      ]
   
      
      let arr1 = _this.data.weightList
      let arr2 = weightList
      const newWeightList = Array.from(new Set([...arr1, ...arr2]))
      _this.setData({
        weightList: newWeightList,
        haveMore: false,
        
      })
    }
  },

  openAnalysis: function () {
    wx.navigateTo({
      url: '/pages/analysis/index',
    })
  },
  openRemeasure:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //手指触摸动作开始 记录起点X坐标
  // touchstart: function (e) {
  //   //开始触摸时 重置所有删除
  //   this.data.weightList.forEach(function (v, i) {
  //     // if (v.isTouchMove)//只操作为true的
  //     //   v.isTouchMove = false;
  //   })
  //   this.setData({
  //     startX: e.changedTouches[0].clientX,
  //     startY: e.changedTouches[0].clientY,
  //     weightList: this.data.weightList
         
  //   })

  // },
  // //滑动事件处理
  // touchmove: function (e) {
  //   var that = this,
  //     index = e.currentTarget.dataset.index,//当前索引
  //     startX = that.data.startX,//开始X坐标
  //     startY = that.data.startY,//开始Y坐标
  //     touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
  //     touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
  //     //获取滑动角度
  //     angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
  //   that.data.weightList.forEach(function (v, i) {
  //     v.isTouchMove = false
  //     //滑动超过30度角 return
  //     if (Math.abs(angle) > 30) return;
  //     if (i == index) {
   
  //       if (touchMoveX > startX) //右滑
  //         v.isTouchMove = false
  //       else //左滑
  //         v.isTouchMove = true
  //     }
  //   })
  //   //更新数据
  //   that.setData({
  //     weightList: that.data.weightList
  //   })
  // },
  // /**
  //  * 计算滑动角度
  //  * @param {Object} start 起点坐标
  //  * @param {Object} end 终点坐标
  //  */
  // angle: function (start, end) {
  //   var _X = end.X - start.X,
  //     _Y = end.Y - start.Y
  //   //返回角度 /Math.atan()返回数字的反正切值
  //   return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  // },
  // //删除事件
  // del: function (e) {
  //   this.data.weightList.splice(e.currentTarget.dataset.index, 1)
  //   this.setData({
  //     weightList: this.data.weightList
  //   })
  // },
  //删除单条记录
  deleteRecord: function (e) {
    const index = e.currentTarget.dataset.index
    const weightList = this.data.weightList
    const _this = this
    wx.showActionSheet({
      itemList: ['删除'],
      success: function (res) {
        if (res.tapIndex === 0) {
          weightList.splice(index, 1)
          _this.setData({
            weightList: weightList
          })
        }
      }
    })
  },

    
})

