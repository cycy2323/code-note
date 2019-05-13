<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import { parseTime } from '@/utils'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import { fetchList } from '../../../api/agency/home'

var Date1 = new Date()
var Date7 = new Date(Date1.getTime() - 144 * 60 * 60 * 1000)
export default {
  filters: {
    filterTime(time) {
      const date = new Date(time)
      return parseTime(date, '{y}-{m}-{d}')
    }
  },
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    },
    startDate: {
      type: String,
      default: Date7
    },
    endDate: {
      type: String,
      default: Date1
    }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null,
      xAxisData: []
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  created() {
    this.getCharts()
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }

    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getCharts() {
      fetchList({ startDate: this.startDate, endDate: this.endDate }).then(data => {
        const xData = []
        data.forEach(item => {
          const Date = item.createDate
          const xDate = parseTime(Date, '{y}-{m}-{d}')
          xData.push(xDate)
        })
        this.xAxisData = xData
      })
    },
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    setOptions({ totalFlowData, transactionFlData, paidFlData } = {}) {
      this.chart.setOption({
        xAxis: {
          data: this.xAxisData,
          boundaryGap: true,
          axisTick: {
            show: false
          }
          // axisLabel: {
          //   interval: 1
          // }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['总流水', '交易流水', '代付流水']
        },
        series: [{
          name: '总流水', itemStyle: {
            normal: {
              color: '#40A3FF',
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          barWidth: 30,
          barCategoryGap: '10%',
          smooth: true,
          type: 'line',
          data: totalFlowData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '交易流水',
          // smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#4A40FF',
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          barWidth: 30,
          barCategoryGap: '10%',
          data: transactionFlData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: '代付流水',
          // smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#FF40EF',
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          barWidth: 30,
          barCategoryGap: '10%',
          data: paidFlData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
