var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');

function select(sql) {
    var promise = new Promise(function(resolve,reject) {
        var result = null;
        var mysql = require('mysql');
        var connection = mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: 'admin',
		  database:'mydb'
        });

        connection.connect();
        connection.query("USE test");
        connection.query(sql, function (err, results, fields) { 
            if (err) { 
                console.log("err");
                reject(err); 
            }else {
                console.log("yes");
                if(results.length > 0) {
                    resolve({status: 99999});
                }else {
                    resolve({status: 00000});
                }           
            } 
          } 
        );
        connection.end(); 
    })

    return promise; 
}


var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser())
router.use(session({
    secret: 'blog'
}))
router.use(function timeLog(req,res,next) {
    var _user = req.session.user;
    if(_user) {
        //router.locals.user = user;
    }
    next();
})

//登录
router.post('/signup',function(req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    select('SELECT * FROM name WHERE name = "'+ name + '" AND password = "' + password + '";').then(function(data) {
        //session存user name和userid
        req.session.user = name;
        data.status > 50 ? data.url = '/html/index.html' : null;
        res.json(data);
        res.end();
        req.redirect("/");
    }).catch(function(err){})

})

//注册
router.post('/register',function(req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    console.log(name+"      "+password)
    select('SELECT * FROM name WHERE name = "'+ name + '";')
        .then(function(data) {
            if(data.status == 99999) {
                console.log("已有此用户名")
                res.json({status:00000});
                res.end();
            }else {
                select('INSERT INTO name(name,password) VALUES ("'+name+'", "'+password+'");')
                .then(function(data) {  
                    res.json({status:99999});
                    res.end();
                }).catch(function(err){})
            }           
        }).catch(function(err){

        })

});

//退出
router.get("/logout",function(req, res) {
    delete req.session.user;
    res.end();
})

//获取session
router.get("/session",function(req, res) {
    console.log("user in session");
    console.log(req.session.user);
    res.json({user:req.session.user});
    res.end();
})

module.exports = router;