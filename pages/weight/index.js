//index.js
//获取应用实例

const app = getApp()
const wxCharts = require('../../utils/wxcharts.js');
Page({
  data: {
    curIndex: 1
  },
  onLoad: function () {
    new wxCharts({
      canvasId: 'weightChart',
      title: {
        name: '体重',
        fontSize: 12
      },
      type: 'line',
      categories: [21, 22, 23, 24,25,26,27],
      animation: true,
      background: '#ffffff',
      series: [{
        name: '成交量1',
        data: [2,  3, 4,  2, 0],
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '成交金额 (万元)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: 350,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
    new wxCharts({
      canvasId: 'fatChart',
      title: {
        name: '体重',
        fontSize: 12
      },
      type: 'line',
      categories: [21, 22, 23, 24, 25, 26, 27],
      animation: true,
      background: '#ffffff',
      series: [{
        name: '成交量1',
        data: [2, 3, 4, 2, 0],
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '成交金额 (万元)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: 350,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  tabHandle: function (e) {
    if (this.data.curIndex === e.target.dataset.index) return
    this.setData({
      curIndex: e.target.dataset.index
    })

  }
})

