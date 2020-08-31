var express = require('express');
var fs = require("fs");
var router = express.Router();
var newsData=require("./db");
var multer=require("multer");
//用户发帖上传图片信息配置
var upload=multer({
    dest:"public/img/",
})

var singleMidle=upload.single("picture");
router.post('/pictureUpload',singleMidle,function (req,res) {
    console.log("上传中。。。");
    var file=req.file;
    var fileName="public/img/"+file.filename+".jpg";
    fs.renameSync(file.path,fileName);
    console.log("上传成功");
    res.send(JSON.stringify(fileName.split("public/")[1]));
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile("views/index.html");
});
router.get('/cblogin', function(req, res, next) {
    res.sendfile("views/cblogin.html");
});
router.get('/admin',function (req,res,next) {
    /*
    if(!req.session.user){
        res.send(JSON.stringify(-1));
    }else{
        res.sendfile("views/community.html");
    }
     */
    res.sendfile("views/admin.html");
})

router.get('/game', function(req, res, next) {
    res.sendfile("views/game.html");
});
router.get('/post',function (req,res,next) {
    res.sendfile("views/post.html");
})
router.get('/community',function (req,res,next) {
    /*
    if(!req.session.user){
        res.send(JSON.stringify(-1));
    }else{
        res.sendfile("views/community.html");
    }
     */
    res.sendfile("views/community.html");
})
router.get('/identity',function (req,res,next) {
    res.sendfile("views/identity.html");
})
router.get('/statis',function (req,res,next) {
    res.sendfile("views/dataStatis.html");
})
router.post('/postNew',function (req,res,next) {
    var data={
        author:req.body.author,
        head:req.body.head,
        content:req.body.content,
        cid:req.body.cid,
    };
    newsData.add(function (message) {
        console.log(message);
        res.send(JSON.stringify(message));
    },data);
})

//获取分区新闻
router.post('/getNews',function (req,res,next) {
    newsData.selectAllNews(function (queryResult) {
        res.send(JSON.stringify(queryResult));
    },req.body.cid)
})
//获取所有新闻
router.post('/getNewsByAM',function (req,res,next) {
    newsData.selectAllNewsByAM(function (queryResult) {
        res.send(JSON.stringify(queryResult));
    })
})
//获取新闻内容
/*
router.get('/getDetail',function (req,res,next) {
    console.log("isfollow:"+req.query.isfollow);
    newsData.getContent(function (queryResult) {
        res.render("detail",{
            news:queryResult[0],
            isfollow:req.query.isfollow
        })
    },req.query.newId)
})
*/
router.get('/getDetail',function (req,res,next) {
    newsData.getContent(function (queryResult) {
        console.log(queryResult);
        res.render("detail",{
            news:queryResult,
        })
    },req.query.newId,req.query.username,req.query.followId)
})
//获取评论内容
router.post('/getComment',function (req,res,next) {
    newsData.getComment(function (queryResult) {
        res.send(JSON.stringify(queryResult));
    },req.body.newId)
})

//发送评论
router.post('/sendComment',function (req,res,next) {
    console.log("正在插入评论...");
    var data={
        newId:req.body.newId,
        username:req.body.username,
        content:req.body.content
    }
    newsData.sendComment(function (message) {
        res.send(JSON.stringify(message));
    },data);
})

//评论点赞
router.post('/commentLike',function (req,res,next) {
    newsData.commentLike(function (message) {
        res.send(JSON.stringify(message));
    },req.body.commentId);
})
//评论点赞取消
router.post('/commentLike_cancel',function (req,res,next) {
    newsData.commentLike_cancel(function (message) {
        res.send(JSON.stringify(message));
    },req.body.commentId);
})
//评论踩
router.post('/commentDislike',function (req,res,next) {
    newsData.commentDislike(function (message) {
        res.send(JSON.stringify(message));
    },req.body.commentId);
})
//评论踩取消
router.post('/commentDislike_cancel',function (req,res,next) {
    newsData.commentDislike_cancel(function (message) {
        res.send(JSON.stringify(message));
    },req.body.commentId);
})
//帖子回复+1
router.post('/commentCount_add',function (req,res,next) {
    newsData.commentCount_add(function (message) {
        res.send(JSON.stringify(message));
    },req.body.newId);
})
//回复某一个评论
router.post("/sendReply",function (req,res,next) {
    let data={
        commentId:req.body.commentId,
        replyer:req.body.replyer,
        receiver:req.body.receiver,
        replyContent:req.body.replyContent,
    }
    newsData.sendReply(function (message) {
        res.send(JSON.stringify(message));
    },data)
})
//回复数+1
router.post("/replyCount_add",function (req,res,next) {
    newsData.replyCount_add(function (message) {
        res.send(JSON.stringify(message));
    },req.body.commentId)
})
//获取某一评论的回复
router.post("/getReplyByCommentId",function (req,res,next) {
    console.log("请求的评论ID："+req.body.commentId);
    newsData.getReplyByCommentId(function (result) {
        console.log("回复列表："+JSON.stringify(result));
        res.send(result);
    },req.body.commentId)
})

//检查是否被禁言
router.post('/check_al',function (req,res,next) {
    newsData.check_al(function (message) {
        res.send(message);
    },req.body.key_name);
})

//ZZZZZMMMMMM
router.get('/gamestory',function(req,res,next){
    res.sendfile("views/Egamestory.html")
})
router.get('/gamestory/apexstory',function(req,res,next){
    res.sendfile("views/apexstory.html")
})
router.get('/gamestory/apexhero',function(req,res,next){
    res.sendfile("views/apexhero.html")
})
router.get('/gamestory/apexhero/character',function(req,res,next){
    newsData.getHeroInfo(function(result){
        console.log(result);
        res.render("character",{
            hero:result,
        });
    },req.query.id)
})
//zzzzzmmmm

/*yt*/
router.get('/zs1',function (req,res,next) {
    res.sendfile("views/zs1.html")
})
router.get('/zs2',function (req,res,next) {
    res.sendfile("views/zs2.html")
})
router.get('/zs3',function (req,res,next) {
    res.sendfile("views/zs3.html")
})
router.get('/zs4',function (req,res,next) {
    res.sendfile("views/zs4.html")
})
module.exports = router;


