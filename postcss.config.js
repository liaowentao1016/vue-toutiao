/**
 * postcss 是基于Node.js 运行的一个处理css的工具
 * 配置文件需要导出一个对象
 */

module.exports = {
  // 配置要使用的相关插件
  plugins: {
    // // 自动添加浏览器前缀 兼容不同的浏览器 Vue-Cli内部已经配置
    // autoprefixer: {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 把px转成rem
    'postcss-pxtorem': {
      rootValue: 37.5, // 按照设计稿
      // rootValue({ file }) {
      //   // 如果是vant的样式就按照37.5处理 如果是我们自己的样式就按照75处理
      //   return file.indexOf('vant') !== -1 ? 37.5 : 75
      // },
      propList: ['*'], // *代表所有属性都要转换
      remPrecision: 2 // rem的小数点后位数
    }
  }
}
