//采用common.js规范
//webpack.config.js最终是基于node环境运行的
//导入path模块，解析路径
let path = require("path");
//console.log(path.resolve("./dist"));
//引入自己下载安装的模块
let HtmlWebpackPlugins = require("html-webpack-plugins");
module.exports = {
    entry:"./src/main.js",// 配置webpack的入口文件；
    output:{
        //打包之后文件的出口；
        //告诉生成的js叫什么文件名
        //默认会把生成的js文件放在当前的目录下，但不便于管理
        //所以引入path（node的核心模块）模块，用于管理生成文件的位置
        filename:'[name].js',
        //name回去entry中查找对应的文件名；属性却可以是文件名
        //通知生成的js放在哪个文件夹下面
        //path.resolve解析出一个绝对路径来
        //当运行webpack时，自动创建一个dist文件夹；并且把生成的js文件放在这个文件夹下面
        //path配置项，会让生成的文件放在当前文件夹下面；会默认创建一个dist文件夹
        //path模块的path.resolve（分解）方法接收一个相对路径，返回一个绝对路径
        path:path.resolve("./dist")

    },
    module:{//用什么解析器
       rules:[
           {test:/\.js$/,use:"babel-loader",exclude:/node_modules/},
           {test:/\.css$/,use:["style-loader,css-loader"]},
           {test:/\.less$/,use:["style-loader","css-loader","less-loader"]},
           //url-loader依赖于file-loader,这里可以不写file-loader
           {test:/\.(png|jpg|gif)$/,use:"url-loader"}
           //node_modules中js不需要进行es6到es5的编译；排除node_modules;
       ]
    },
    plugins:[
        new HtmlWebpackPlugins({

        })
    ]
}