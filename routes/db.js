let mysql = require("mysql");
let dbConfig=require("./dbConfig");
let pool=mysql.createPool(dbConfig);
let sql={
    add:"insert into new_(username,head,content,cid) value(?,?,?,?)",
    selectAllNews:"select * from new_,user_ where new_.username=user_.username and cid=? order by new_.postTime desc",
    selectAllNewsByAM:"select * from new_,user_ where new_.username=user_.username order by new_.postTime desc",
    getDetail:"select * from new_,user_ where new_.username=user_.username and new_.newId=?",
    getComment:"select * from user_,comment_ where comment_.username=user_.username and comment_.newId=?",
    sendComment:"insert into comment_(newId,username,content) value(?,?,?)",
    commentLike:"update comment_ set likeCount=likeCount+1 where commentId=?",
    commentLike_cancel:"update comment_ set likeCount=likeCount-1 where commentId=?",
    commentDislike:"update comment_ set dislikeCount=dislikeCount+1 where commentId=?",
    commentDislike_cancel:"update comment_ set dislikeCount=dislikeCount-1 where commentId=?",
    commentCount_add:"update new_ set commentCount=commentCount+1 where newId=?",
    isCollect:"select count(*) as count from collect_ where username=? and newId=?",
    check_follow:"select count(*) as count from follow_ where username=? and followId=?",
    sendReply:"insert into reply_(commentId,replyer,receiver,replyContent) value(?,?,?,?)",
    getReplyByCommentId:"select * from reply_,user_ where reply_.replyer=user_.username and commentId=?",
    replyCount_add:"update comment_ set replyCount=replyCount++1 where commentId=?",
	check_allow:"select * from user_ where username=?",
    getHeroInfo:"select * from ahero where id=?",
}

//将数据库的时间改为与当前时间间隔的形式
function getDateDiff(dateTimeStamp){
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if(diffValue < 0){return;}
    var monthC =diffValue/month;
    var weekC =diffValue/(7*day);
    var dayC =diffValue/day;
    var hourC =diffValue/hour;
    var minC =diffValue/minute;
    if(monthC>=1){
        result="" + parseInt(monthC) + "月前";
    }
    else if(weekC>=1){
        result="" + parseInt(weekC) + "周前";
    }
    else if(dayC>=1){
        result=""+ parseInt(dayC) +"天前";
    }
    else if(hourC>=1){
        result=""+ parseInt(hourC) +"小时前";
    }
    else if(minC>=1){
        result=""+ parseInt(minC) +"分钟前";
    }else
        result="刚刚";
    return result;
}
//比较日期
function CompareDate(d1,d2)
{
  return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
}
//获取用户是否收藏该帖子
let isCollect=(callback,username,newId)=>{
    pool.getConnection(function (err,connection) {
        connection.query(sql.isCollect,[username,newId],function (err,result) {
            if(err){
                throw err;
                callback(0);
            }else{
                callback(result[0].count);
            }
            connection.release();
        })
    })
}
//获取用户是否关注作者
let check_follow=(callback,username,followId)=>{
    pool.getConnection(function (err,connection) {
        connection.query(sql.check_follow,[username,followId],function (err,result) {
            if(err){
                throw err;
            }else{
                callback(result[0].count);
            }
            connection.release();
        })
    })
}
exports.add=(callback,data)=>{
    pool.getConnection(function (err,connection) {
        if(err) throw err;
        connection.query(sql.add,[data.author,data.head,data.content,data.cid],function (err,result) {
            if(err){
                console.log("插入新闻失败,错误:"+err.stack);
                callback(0);
            }else{
                callback(1);
            }
            connection.release();
        })
    })
}
exports.selectAllNews=(callback,cid)=>{
    pool.getConnection(function (err,connection) {
        if(err) throw err;
        connection.query(sql.selectAllNews,[cid],function (err,result) {
            if(err){
                console.log("插入新闻失败,错误:"+err.stack);
            }
            //处理帖子发布的时间
            for(let i=0;i<result.length;i++){
                result[i].postTime=getDateDiff(result[i].postTime);
            }
            callback(result);
            connection.release();
        })
    })
}
exports.selectAllNewsByAM=(callback)=>{
    pool.getConnection(function (err,connection) {
        if(err) throw err;
        connection.query(sql.selectAllNewsByAM,function (err,result) {
            if(err){
                console.log("插入新闻失败,错误:"+err.stack);
            }
            //处理帖子发布的时间
            for(let i=0;i<result.length;i++){
                result[i].postTime=getDateDiff(result[i].postTime);
            }
            callback(result);
            connection.release();
        })
    })
}
exports.getContent=(callback,newId,username,followId)=>{
    pool.getConnection(function (err,connection) {
        connection.query(sql.getDetail,[newId],function (err,result) {
            if(err) throw err;
            result[0].postTime=getDateDiff(result[0].postTime);
            result[0].isCollect=null;
            result[0].isFollow=null;
            isCollect(function (count) {
                result[0].isCollect=count;
            },username,newId);
            check_follow(function (count) {
                result[0].isFollow=count;
            },username,followId);

            //设置计时器等待上方函数赋值完毕再传结果给router
            setTimeout(function () {
                callback(result[0]);
            },800);
            connection.release();
        })
    })
}
exports.getComment=(callback,newId)=>{
    pool.getConnection(function (err,connection) {
        connection.query(sql.getComment,[newId],function (err,result) {
            if(err) throw err;
            //处理评论发布的时间
            for(let i=0;i<result.length;i++){
                result[i].commentTime=getDateDiff(result[i].commentTime);
            }
            callback(result);
            connection.release();
        })
    })
}
exports.sendComment=(callback,data)=>{
    pool.getConnection(function (err,connection) {
        connection.query(sql.sendComment,[data.newId,data.username,data.content],function (err,result) {
            if(err){
                throw err;
                callback(0);
            }else{
                callback(1);
            }
            connection.release();
        })
    })
}
//评论点赞
exports.commentLike=(callback,commentId)=>{
    pool.getConnection(function (err,connection) {
        connection.query(sql.commentLike,[commentId],function (err,result) {
            if(err){
                throw err;
                callback(0);
            }else{
                callback(1);
            }
            connection.release();
        })
    })
}
//评论点赞取消
exports.commentLike_cancel=(callback,commentId)=>{
    pool.getConnection(function (err,connection) {
        connection.query(sql.commentLike_cancel,[commentId],function (err,result) {
            if(err){
                throw err;
                callback(0);
            }else{
                callback(1);
            }
            connection.release();
        })
    })
}
//评论踩
exports.commentDislike=(callback,commentId)=>{
    pool.getConnection(function (err,connection) {
        connection.query(sql.commentDislike,[commentId],function (err,result) {
            if(err){
                throw err;
                callback(0);
            }else{
                callback(1);
            }
        })
    })
}
//评论踩取消
exports.commentDislike_cancel=(callback,commentId)=>{
    pool.getConnection(function (err,connection) {
        connection.query(sql.commentDislike_cancel,[commentId],function (err,result) {
            if(err){
                throw err;
                callback(0);
            }else{
                callback(1);
            }
            connection.release();
        })
    })
}
//帖子回复+1
exports.commentCount_add=(callback,newId)=>{
    pool.getConnection(function (err,connection) {
        connection.query(sql.commentCount_add,[newId],function (err,result) {
            if(err){
                throw err;
                callback(0);
            }else{
                callback(1);
            }
            connection.release();
        })
    })

}
//回复某一评论
exports.sendReply=(callback,data)=>{
    pool.getConnection(function (err,connection) {
        connection.query(sql.sendReply,[data.commentId,data.replyer,data.receiver,data.replyContent],function (err,result) {
            if(err){
                throw err;
                callback(0);
            }else{
                callback(1);
            }
            connection.release();
        })
    })
}
//评论回复数+1
exports.replyCount_add=(callback,commentId)=>{
    pool.getConnection(function (err,connection) {
        connection.query(sql.replyCount_add,[commentId],function (err,result) {
            if(err){
                throw err;
                callback(0);
            }else{
                callback(1);
            }
            connection.release();
        })
    })
}
//获取某一个评论的回复记录
exports.getReplyByCommentId=(callback,commentId)=>{
    pool.getConnection(function (err,connection) {
        connection.query(sql.getReplyByCommentId,[commentId],function (err,result) {
            if(err){
                throw err;
                callback(0);
            }else{
                callback(result);
            }
            connection.release();
        })
    })

}
//检查是否被禁言
exports.check_al=(callback,key_name)=>{
    pool.getConnection(function (err,connection) {
        connection.query(sql.check_allow,[key_name],function (err,result) {
            if(err){
                throw err;
                callback("0");
            }else{
				var now=new Date();
                callback(JSON.stringify(result[0].key));
            }
            connection.release();
        })
    })
}
//查看英雄信息
exports.getHeroInfo=(callback,id)=>{
    pool.getConnection(function (err,connection) {
        connection.query(sql.getHeroInfo,[id],function (err,result) {
            if(err){
                throw err;
                callback(result);
            }else{
                callback(result);
            }
            connection.release();
        })
    })
}