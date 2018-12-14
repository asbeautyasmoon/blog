var express = require('express');                          //exprss框架
var app = express();

app.use('/public', express.static(__dirname + '/public/')); //开启访问公共目录绝对路径，使用拼接
app.use('/node_modules', express.static(__dirname + '/node_modules/'));

app.engine('html', require('express-art-template')); //express的模板引擎，要下载两个包template 和express-art-template
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
});

var bodyParser = require('body-parser');    //post请求
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

var session = require('express-session');     //session模块插件 需先安装
//    添加 Session 数据：req.session.foo = 'bar'
//    访问 Session 数据：req.session.foo
app.use(session({
  secret: 'blog',// 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密 // 目的是为了增加安全性，防止客户端恶意伪造
  resave: false,
  saveUninitialized: false // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙 //FALSE 当session有设置时，才给客户端
}));

var router = require('./router');           //路由设置文件
app.use(router);


app.listen(3000, function() {
    console.log('  running at port 3000.');
});