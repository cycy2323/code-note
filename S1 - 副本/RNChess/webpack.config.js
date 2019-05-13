/**
 * @description: 用于开发工具别名检索提示
 *
 * intellij idea/webStorm setting > File | Settings | Languages & Frameworks | JavaScript | Webpack
 *
 * 将此设置下的webpack路径改为本文件的绝对路径。
 *
 * FIXME 只用于开发工具检索提示功能， 请勿在业务中直接引用，别名引用请用soul中的配置
 * @author nick
 * @create: 2019-01-06 16:09
 **/
const path = require('path')
module.exports = {
  resolve : {
    alias: {
      common: path.join(__dirname, './src/common'),
      soul: path.join(__dirname, './node_modules/@soul/react'),
      react: path.join(__dirname, './node_modules/react'),
      'antd-mobile': path.join(__dirname, './node_modules/antd-mobile')
    }
  }
}
