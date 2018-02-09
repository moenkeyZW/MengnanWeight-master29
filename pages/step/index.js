//index.js
//获取应用实例
const app = getApp()
const wxCharts = require('../../utils/wxcharts.js');
const chartData = {
  main: {
    title: '总成交量',
    data: [8000,5880,5450,5550,6800,7000,8200],
    categories: ['26', '27', '28', '29', '30', '31', '1']
  },
  /*
  sub: [{
    title: '2012年度成交量',
    data: [70, 40, 65, 100, 34, 18],
    categories: ['1', '2', '3', '4', '5', '6']
  }, {
    title: '2013年度成交量',
    data: [55, 30, 45, 36, 56, 13],
    categories: ['1', '2', '3', '4', '5', '6']
  }, {
    title: '2014年度成交量',
    data: [76, 45, 32, 74, 54, 35],
    categories: ['1', '2', '3', '4', '5', '6']
  }, {
    title: '2015年度成交量',
    data: [76, 54, 23, 12, 45, 65],
    categories: ['1', '2', '3', '4', '5', '6']
  }]
  */
};
Page({
  data: {
    curIndex: 0
  },
  onLoad: function () {
    
  },
  tabHandle: function (e) {
    const index = e.target.dataset.index || e.currentTarget.dataset.index
    if (this.data.curIndex === index) return
    this.setData({
      curIndex: index
    }, () => {
      // if (index === 1)
      new wxCharts({
        canvasId: 'stepChart',
        type: 'column',
        animation: true,
        categories: chartData.main.categories,
        
        series: [{
          name: '步数',
          data: chartData.main.data,
          format: function (val, name) {
            return val.toFixed(2) + '步';
          }
        }],
         
        // yAxis: {
        //   format: function (val) {
        //     return val + '万';
        //   },
        //   title: 'hello',
        //   min: 0
        // },
        xAxis: {
          disableGrid: false,
          type: 'calibration'
        },
        extra: {
          column: {
            width: 15
          }
        },
        width: 375,
        height: 400,
      });
    })
  }
})
