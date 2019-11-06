const {override, fixBabelImports, addLessLoader} = require("customize-cra")

module.exports = override(
    //针对antd实现按需打包，根据import来打包（使用babel-plugin-import）
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        //自动打包相关的样式
        //style: 'css'
        style: true // 引入源码文件
    }),
    // 使用less-loader对源码中的less的变量进行从新指定
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {"@primary-color": "#1DA57A"}

    }),
);