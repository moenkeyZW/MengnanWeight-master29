//index.js
//获取应用实例
const app = getApp()
const wxCharts = require('../../utils/wxcharts.js');
const chartData = {
  main: {
    title: '步数',
    data: [2000, 2220, 1000, 2237, 8220, 24555, 2237, 2220, 4555, 2237],
    categories: [26, 27, 28, 29, 30, 31, 1, 30, 31, 1]
  }
};
const da = new Date();
var year = da.getFullYear() + '年';
var month = da.getMonth() + 1 + '月';
const today = year + month;


const goalArr = [];
for(let i=2000;i<=30000;i+=1000){
    goalArr.push(i);
}


var lineChart = null;
Page({
  data: {
    curIndex: 0,
    stepData:null,
    userInfo:{},
    //showChangeGoalModal: true,
    today: today,
    goalArr: goalArr,
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
  onLoad: function (options) {
   const stepData={
      count: 3333,
      goalArr: 8000,
      distance: 0.9,
      gas: 0.07,
      calorie: 12,
      fat: 10,
      oxygen:'',
    }
    const userInfo={
      weight:70,
      height:175,
    }
  //  耗氧量（ml）=3(MET 梅脱) * 3.5（ml / kg / min 每分钟耗氧指数）*XX（kg体重）*X（min分钟）（分钟 = 总步数 / 90（步 / 分钟））
  //  消耗能量（Kcal）=4.924kcal（固定指数）*耗氧量（L注意换算）
    const gas = (stepData.count / 0.7 * 0.00008).toFixed(2);
    const oxygen=(3*3.5*userInfo.weight*(stepData.count/90))/1000;
    const calorie=(4.924*oxygen).toFixed(0);
    const fat =(calorie/9.3).toFixed(0);
    const distance = ((stepData.count*0.7)/1000).toFixed(1);
    this.setData({
      stepData:stepData,
      'stepData.gas':gas,
      'stepData.calorie': calorie, 
      'stepData.fat':fat,
      'stepData.distance':distance,
    })
  },

  onShow: function () {
    // wx.getWeRunData({
    //   success(res) {
    //     const encryptedData = res.encryptedData
    //     console.log(res)
    //   }
    // })
   
  },
  
  tabHandle: function (e) {
    const index = e.target.dataset.index || e.currentTarget.dataset.index
    if (this.data.curIndex === index) return
    this.setData({ 
      curIndex: index
    }, () => {
      if (this.data.curIndex === 1) {
         lineChart=new wxCharts({
          canvasId: 'stepChart',
          type: 'column',
          animation: true,
          categories: chartData.main.categories,
          series: [{
            name: '步数',
            data: chartData.main.data,
            color: '#19b4f2',
            format: function (val, name) {
              return val;
            }
          }],
          yAxis: {
            disabled:true,
            min:0,
            max:28000,
          },
          xAxis: {
            disableGrid: false,
            type: 'calibration'
          },
          enableScroll: true,
          extra: {
            column: {
              width: 15
            },
          },
          width: 375,
          height: 400,
        });
      }
    })
  },

  pickGoal: function (e) {
    this.setData({
      [`stepData.goalArr`]: Number.parseInt(e.detail.value) * 1000 + 2000
    })
  },
  // showGoalModal: function () {
  //   this.setData({
  //     showChangeGoalModal: false
  //   })
  // },
  // inputStep: function (e) {
  //   if (e.detail.value === '') return
  //   this.setData({
  //     goal: e.detail.value
  //   })
  // },
  // //点击确定修改目标步数
  // confirm: function () {
  //   this.setData({
  //     showChangeGoalModal: true,
  //     'stepData.goal': this.data.goal
  //   })
  // },
  // // 取消
  // cancel: function () {
  //   this.setData({
  //     showChangeGoalModal: true
  //   })
  // }
})
