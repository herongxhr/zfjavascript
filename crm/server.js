let http = require("http");
let url = require("url");
let fs = require("fs");
//http://nodejs.cn/api/querystring.html
//querystring 模块提供了一些实用函数，用于解析与格式化 URL 查询字符串。 可以通过以下方式使用：
let querystring = require('querystring');

let server = http.createServer(function (req, res) {
    //解析出路径和路径参数
    //query存储的是前端请求传过来的参数；通过url来获取参数
    let {pathname, query} = url.parse(req.url, true);

    //输入/index.html，打开默认网页，必须是带有后缀名的路径
    if (/\.(?:\w+)$/g.test(pathname)) {
        //只有pathname中有.xxx后缀
        fs.readFile("." + pathname, "utf8", function (err, data) {
            res.end(data);
        });
    }

    //把读出来的内容响应给客户端
    //下面是要操作的数据
    let path = "./json/custom.json";
    let obj = {
        "code": 0,
        "msg": "成功",
        data: null
    }
    //获取用户所有数据
    if (pathname === "/getList") {
        fs.readFile(path, "utf8", function (err, data) {
            obj.data = data;
            res.end(JSON.stringify(obj));
        })
    }

    //新增客户
    if (pathname === "/addInfo") {
        //接收一下客户端post过来的数据。
        let postData;
        req.on("data", function (chunk) {
            //对于服务器和客户端来说，数据不能一下子传送给服务器
            //数据传输就会触发这个回调函数
            postData = chunk;
        })
        //一旦服务器接收到客户端请求体中所有的数据，就会触发end对应的回调函数
        //传送过来的数据，并且是一个json格式的字符串
        req.on("end", function () {
            console.log(postData);
        })
    }
});

server.listen(8080, function () {
    console.log("服务启动");
});