//这里是整个Vue项目的主配置文件
module.exports = {
  //配置Webpack相关的属性
  configureWebpack: {
    module:{
      rules:[{
        test: /\.ico$/,
        loader: 'file-loader'
      }]
    }
  }
}