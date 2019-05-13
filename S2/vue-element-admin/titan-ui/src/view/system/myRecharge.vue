<template>
  <div class="quota-scope-container">
    <el-container>
      <el-header>
        充值额度范围
      </el-header>
      <el-main>
        <div class="el-main-content-1">
          <div class="el-main-title">
            <span>PC端</span>
          </div>
          <div>
            <el-table
              :data="tableData1"
              :header-cell-style="tableHeaderColor"
              :row-class-name="tableRowClassName"
              border
              size="mini"
              stripe
              style="width: 96%;height: auto;">
              <el-table-column
                prop="paymentMethod"
                label="支付方式"
                align="center">
                <template slot-scope="scope">
                  <span>
                    {{ changPayment[scope.row.payType] }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="minMoney"
                align="center"
                label="最小金额（元）">
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.pcMinAmount }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="minMoney"
                align="center"
                label="最大金额（元）">
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.pcMaxAmount }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>

        </div>
        <div class="el-main-content-2">
          <div class="el-main-title">
            <span>WAP端</span>
          </div>
          <div>
            <el-table
              :data="tableData2"
              :header-cell-style="tableHeaderColor"
              border
              size="mini"
              stripe
              style="width: 96%;height: auto;"
            >
              <el-table-column
                prop="paymentMethod"
                label="支付方式"
                align="center">
                <!--<template slot-scope="scope">-->
                <!--{{ scope.row.changPayment[item.payType] }}-->
                <!--</template>-->
                <template slot-scope="scope">
                  <span>
                    {{ changPayment[scope.row.payType] }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="minMoney"
                align="center"
                label="最小金额（元）">
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.wapMinAmount }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="minMoney"
                align="center"
                label="最大金额（元）">
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.wapMaxAmount }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getRecharge } from '@/api/merchant/myRecharge'

const changPayment = {
  'ZFB': '支付宝',
  'BANK': '网银',
  'QQ': 'QQ支付',
  'QQ_H5': 'QQ支付H5',
  'ZFB_H5': '支付宝H5',
  'ZFB_WAP': '支付宝WAP'
}

export default {
  filters: {},
  data() {
    return {
      pcTableHeader: ['支付方式', '最小金额（元）', '最大金额（元）'],
      wapTableHeader: ['支付方式', '最小金额（元）', '最大金额（元）'],
      changPayment,
      tableData1: null,
      tableData2: null,
      receivePayType: '',
      payTypeTotal: []
    }
  },
  created() {
    this.seeRecharge()
  },
  methods: {
    seeRecharge() {
      getRecharge().then(response => {
        this.tableData1 = response.data
        this.tableData2 = response.data
      })
    },
    // 修改table 表头的背景色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #F7F6Fd;'
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    }
  }

}
</script>
<style scoped>
@import '../../style/myRecharge.css';

</style>
