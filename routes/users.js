var express = require('express');
var router = express.Router();
var userData=require("./userdb");
var fs = require("fs");
/* GET users listing. */
function User(username,pwd){
    this.username=username;
    this.pwd=pwd;
}
var multer=require("multer");
//用户上传头像
var upload=multer({
    dest:"public/userHead/",
})
var singleMidle=upload.single("userHead");
router.post('/userHeadUpload',singleMidle,function (req,res) {
    console.log("上传中。。。");
    var file=req.file;
    var fileName="public/userHead/"+file.filename+".jpg";
    fs.renameSync(file.path,fileName);
    res.send(JSON.stringify(fileName.split("public/userHead/")[1].split(".")[0]));
})
//修改数据库的头像地址src
router.post('/changeUserHead',function (req,res,next) {
    console.log("开始修改");
    userData.changeUserHead(function (message) {
        if(message==1){
            res.send(JSON.stringify(1));
        }else{
            res.send(JSON.stringify(0));
        }
    },req.body.src,req.body.username);
})
router.post('/checkLogin',function (req,res,next) {
    var txt_user=req.body.username;
    var txt_pwd=req.body.pwd;
    console.log(txt_user);
    console.log(txt_pwd);
    userData.checkLogin(function (result) {
        req.session.user=new User(result.username,result.pwd);
        res.send(JSON.stringify(result));
    },txt_user,txt_pwd)
})
router.post('/register',function (req,res,next) {
    var reg_user=req.body.username;
    var reg_pwd=req.body.pwd;
    userData.register(function (result) {
        req.session.user=new User(result.username,result.pwd);
        console.log("注册返回结果："+JSON.stringify(result));
        res.send(JSON.stringify(result));
    },reg_user,reg_pwd)
})
router.post('/changePwd',function (req,res,next) {
    var change_newPwd=req.body.newPwd;
    var change_user=req.body.username;
    var change_pwd=req.body.currentPwd;
    userData.changePwd(function (result) {
        res.send(JSON.stringify(result));
    },change_newPwd,change_user,change_pwd)
})
router.post('/follow',function (req,res,next) {
    var username=req.body.username;
    var followId=req.body.followId;
    userData.follow(function (message) {
        res.send(JSON.stringify(message));
    },req.body.username,req.body.followId)
})

router.post('/follow_cancel',function (req,res,next) {
    var username=req.body.username;
    var followId=req.body.followId;
    userData.follow_cancel(function (message) {
        res.send(JSON.stringify(message));
    },req.body.username,req.body.followId)
})

router.post('/check_follow',function (req,res,next) {
    console.log("检查关注");
    var username=req.body.username;
    var followId=req.body.followId;
    userData.check_follow(function (data) {
        res.send(JSON.stringify(data));
    },req.body.username,req.body.followId)
})
router.post('/getPostRecord',function (req,res,next) {
    userData.getPostRecord(function (data) {
        res.send(JSON.stringify(data));
    },req.body.username)
})
router.post('/getReplyRecord',function (req,res,next) {
    userData.getReplyRecord(function (data) {
        res.send(JSON.stringify(data));
    },req.body.username)
})
router.post('/getCollectRecord',function (req,res,next) {
    userData.getCollectRecord(function (data) {
        res.send(JSON.stringify(data));
    },req.body.username)
})
router.post('/getFollow',function (req,res,next) {
    userData.getFollow(function (count) {
        res.send(JSON.stringify(count));
    },req.body.username)
})
router.post('/getFans',function (req,res,next) {
    userData.getFans(function (count) {
        res.send(JSON.stringify(count));
    },req.body.followId)
})
router.post('/collectNew',function (req,res,next) {
    console.log("进入路由");
    userData.collectNew(function (message) {
        res.send(JSON.stringify(message));
    },req.body.username,req.body.newId);
})
router.post('/collectNew_cancel',function (req,res,next) {
    userData.collectNew_cancel(function (message) {
        res.send(JSON.stringify(message));
    },req.body.username,req.body.newId)
})
router.post('/delPostRecord',function(req,res,next){
    userData.delPostrecord(function(message){
        res.send(message);
    },req.body.cid);
})

router.post('/getusers',function(req,res,next){
	userData.getusers(function(message){
		res.send(message);
	});
});

router.post('/addnot',function(req,res,next){
	userData.adduser_not(function(message){
		res.send(message);
	},req.body.key_name,req.body.dateline);
});
//禁言
router.post('/ban',function(req,res,next){
	userData.user_ban(function(message){
		res.send(message);
	},req.body.ban_name,req.body.dateline);
});

//解禁用户
router.post('/free',function(req,res,next){
	userData.free(function(message){
		res.send(message);
	},req.body.free_name,req.body.dateline)
});

//删除帖子
router.post('/del_tie',function(req,res,next){
	userData.del_tie(function(message){
		res.send(message);
	},req.body.del_tie);
});

//获取所有关注
router.post('/followRecord',function(req,res,next){
    userData.followRecord(function(list){
        res.send(JSON.stringify(list));
    },req.body.username);
});
//获取所有粉丝
router.post('/fansRecord',function(req,res,next){
    userData.fansRecord(function(list){
        res.send(JSON.stringify(list));
    },req.body.username);
});
module.exports = router;
