//导入模块
//http模块
let http = require("http");
//url模块
let url = require("url");
//fs模块
let fs = require("fs");

//创建服务
//创建http服务
//当访问这个服务时，触发回调函数
let sever = http.createServer(function (req, res) {
    //req:代表的是请求体中信息
    //res:代表响应体的信息
    //console.log(req.url);
    //req.url代表的是请求的地址；路径（端口后的部分）

    //调用url模块的parse()方法
    //返回一个url对象
    //console.log(url.parse(req.url, true));
    // Url {
    //     protocol: null,
    //         slashes: null,
    //         auth: null,
    //         host: null,
    //         port: null,
    //         hostname: null,
    //         hash: null,
    //         search: '?name=abc',
    //         query: 'name=abc',
    //         pathname: '/login', //路径
    //         path: '/login?name=abc',
    //         href: '/login?name=abc'
    //      }
    //
    //  url.parse(url,true)：第二个参数表示是否以对象形式返回query属性
    //  默认是false：以字符串形式返回

    //res.end()可以打开服务器向客户端传输数据的通道,把数据放入形参即可
    //当客户端向服务器发送请求时，服务器先发送给客户端一个响应头；响应头包含当前数据的信息
    //如内容长度，数据类型。。浏览器会按照浏览器的响应头来进行解析。
        //常见的响应类型
        //text:text/plain
        //html:text/html
        //css:text/css
        //js:application/javascript
        //png:image/png
        //json:application/json
        //Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
    //setHeader()方法一次只能设置一组值


    //响应文本
    //res.setHeader("Content-Type","text/plain;charset=UTF-8")
    //res.end("今天处暑");

    //响应html
    //设置响应头，如果 是html文件，可以不设置响应头，浏览器会自动识别
    //res.setHeader('Content-Type','text/html;charset=utf-8')
   fs.readFile('test.html','utf-8',(err, data)=>{
        res.end(data);
    })
});

//监听
//端口0-65535；建议mac3000以上
//第一个参数：监听的端口
//第二个参数：当服务启动，就会调用这个回调函数
//一个端口只能一个服务进行监听，否则会出现端口号占用
//也不能一个服务监听多个端口
sever.listen(8080,function () {
   console.log('服务启动');
});