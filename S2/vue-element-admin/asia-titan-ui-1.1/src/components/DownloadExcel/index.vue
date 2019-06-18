<template>
  <span style="margin-left: 10px;">
    <span class="drop">
      <el-button
        v-waves
        :loading="loading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleExport">导出
      </el-button>
    </span>
    <div v-if="downloading && downloadStatu" style="display: inline-block; width: 150px;">导出进度：{{ downloadStatu+'%' }}</div>
  </span>
</template>

<script>
import waves from '@/directive/waves'
import { parseTime } from '@/utils'

export default {
  directives: { waves },
  props: {
    getOrderList: Function,// eslint-disable-line
    titleName: {
      type: String,
      default: 'table-list'
    },
    tHeader: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    timeArray: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    filterVal: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    downloadStatu: {
      type: Number,
      required: false,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      loading: false,
      downloading: false
    }
  },
  methods: {
    handleExport() {
      this.loading = true
      this.downloading = true
      // 获取所有数据
      this.getOrderList().then((res) => {
        this.loading = false
        this.downloading = false
        // 进入下一步：生成excel导出
        res && import('@/vendor/Export2Excel').then(excel => {
          const data = this.formatJson(this.filterVal, res)
          excel.export_json_to_excel({
            header: this.tHeader,
            data,
            filename: this.titleName
          })
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (this.timeArray.indexOf(j) !== -1) { // excel的单元格格式   j==="updateDate"
          if (v[j]) {
            return parseTime(v[j]) // 导入公共函数例子 parseTime
          } else { return '' }
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style scoped>
  .drop{
  }
</style>
