var express = require('express');
var router = express.Router(); //创建路由对象

var users = require('./modules/mongo.js'); //引入自己定义的数据库模块  需要安装mogoose  

var md5 = require('blueimp-md5');    //加密模块 须下载



router.get('/', function(req, res) {
    console.log(req.session.users);
    res.render('index.html', {user:req.session.users});    //把取得的session直接传入模板即可
});

router.get('/register/', function(req, res) {
    res.render('register.html', {});
});


router.post('/register/', function(req, res) {
    //console.log(req.body);  //测试是否接收到post
    users.findOne({ //查询出一个，是对象
        email: req.body.email,
    }, function(err, ret) {
        if (err) {
	        return res.status(500).json({               //这里其实可以像这样直接err 就return掉 就不需要这么多嵌套else了
	        err_code: 500,
	        message: err.message});
        } else {                           
            //console.log(ret);
            if (ret) { //查到的话
                res.send(JSON.stringify({ err_code: 1 })); //根据前端ajax的内容写
            } else {
                users.findOne({
                    username: req.body.username,
                }, function(err, ret) {
                    if (err) {
                        console.log('查询失败');

                    } else {
                        if (ret) { //查到的话
                            res.send(JSON.stringify({ err_code: 2 })); //根据前端ajax的内容写
                        } else {
                            new users({
                                username: req.body.username,
                                email: req.body.email,
                                password: md5(md5(req.body.password+"blog")),
                            }).save(function(err, ret) {
                                if (err) {
                                    console.log('保存失败',err);
                                } else {
                                    res.send(JSON.stringify({ err_code: 0 }));
                                    req.session.users = ret ;     //设置session
                                }
                            });
                        }
                    }
                });
            }
        }
    });

});


router.get('/login/', function(req, res) {
    res.render('login.html', {});
});

router.post('/login/', function(req, res) {
    users.findOne({                                  //这里查询就要用并了
                    email: req.body.email,
                    password:md5(md5(req.body.password+"blog")),
    },function(e,d){
    	if (e) {
    		return res.status(500).json({err_code: 500,message:e.message });            //send(JSON.stringifg())可以简写 res.status(500)返回值仍是res
    	}
    	if(d){
    		req.session.users = d ;     //设置session
    		//console.log(d,'设置session');
    		return res.json({err_code: 0,message:'ok'});
    	}

    	res.json({err_code: 5,message:'wrong'});

    });









});






module.exports = router;