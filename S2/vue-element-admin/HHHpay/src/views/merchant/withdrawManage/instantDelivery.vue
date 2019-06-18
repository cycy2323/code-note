<template>
  <div class="app-main-container">
    <h3>即时下发，敬请期待！</h3>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // 引入分页组件
import { parseTime } from '@/components/parseTime' // 引入格式化时间日期组件
export default {
  name: 'instantDelivery',
  components: { Pagination, parseTime },
  data () {
    return {
      list: [],
      operateDate: [],
      listQuery: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        account: '',
        user: ''
      },
      listLoading: false,
      tableKey: 0
    }
  },
  methods: {
    gitList () {},
    refreshList () {
      this.listQuery.pageNo = 1
    },
    dateChange () {
      if (this.operateDate) {
        this.listQuery.createDateStart = parseTime(this.operateDate[0], '{y}-{m}-{d} {h}:{i}:{s}')
        this.listQuery.createDateEnd = parseTime(this.operateDate[1], '{y}-{m}-{d} {h}:{i}:{s}')
      } else {
        this.listQuery.createDateEnd = ''
        this.listQuery.createDateStart = ''
      }
    }
  }
}
</script>

<style>
  .app-main-container .el-form .statistics-wrapper .el-form-item__label {
    font-size: 16px;
    color: #02A5BD;
    letter-spacing: 1px;
    /*line-height: 22px;*/
  }
  .app-main-container .el-form .statistics-wrapper span {
    font-size: 16px;
    color: #02A5BD;
    letter-spacing: 1px;
    /*line-height: 19px;*/
  }
  /*调整表格表头每行的高度*/
  .el-table td, .el-table th {
    padding: 5px 0;
  }
</style>
