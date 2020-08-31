let mysql = require("mysql");
let dbConfig=require("./dbConfig");
let pool=mysql.createPool(dbConfig);
let userSql={
    checkLogin:"select * from user_ where username=?",
    register:"insert into user_(username,pwd) value(?,?)",
    changePwd:"update user_ set pwd=? where username=? and pwd=?",
    check_follow:"select count(*) as count from follow_ where username=? and followId=?",
    follow:"insert into follow_(username,followId) value(?,?)",
    follow_cancel:"delete from follow_ where username=? and followId=?",
    getFansCount:"select count(*) from fans_ where username=?",
    getPostRecord:"select * from new_ where username=?",
    getReplyRecord:"select *,\n" +
        "new_.username as newAuthor,comment_.username as commentAuthor,\n" +
        "comment_.content as commentContent,new_.content as newContent,\n" +
        "comment_.likeCount as commentLikeCount,comment_.commentTime as commentTime \n"+
        "from new_,comment_ where comment_.username=? and comment_.newId=new_.newId",
    getCollectRecord:"select new_.username as newAuthor,collect_.newId,collect_.collectTime,new_.head,new_.commentCount,new_.likeCount \n" +
        "from collect_,new_ \n" +
        "where collect_.username=? and collect_.newId=new_.newId",
    changeUserHead:"update user_ set src=? where username=?",
    getFollow:"select count(*) as count from follow_ where username=?",
    getFans:"select count(*) as count from follow_ where followId=?",
    collectNew:"insert into collect_(username,newId) value(?,?)",
    collectNew_cancel:"delete from collect_ where username=? and newId=?",
    delPostrecord:"delete from new_ where newId=?",
	getusers:"select * from user_ where username not in(?)",
	add_not:"update user_ SET user_.key=? where username=?",
	free:"update user_ SET user_.key=? where username=?",
	del_tie:"delete from new_ where newId=?",
    followRecord:"select follow_.followId as name,user_.src as src\n" +
        "from user_,follow_\n" +
        "where follow_.username=? and follow_.followId=user_.username",
    fansRecord:"select follow_.username as name,user_.src as src\n" +
        "from user_,follow_\n" +
        "where follow_.followId=? and follow_.username=user_.username"
}
exports.sql=userSql;
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
exports.checkLogin=(callback,txt_user,txt_pwd)=>{
    pool.getConnection(function (err,connection) {
        connection.query(userSql.checkLogin,[txt_user],function (err,result) {
            if(err){
                throw err;
                callback(-1);
            }
            if(result[0].pwd==txt_pwd){
                let data={
                    message:1,
                    username:result[0].username,
                    pwd:result[0].pwd,
                    src:result[0].src,
                    key:result[0].key
                }
                callback(data);
            }else{
                callback(0);
            }
            connection.release();
        })
    })
}
exports.register=(callback,username,pwd)=>{
    pool.getConnection(function (err,connection) {
        connection.query(userSql.register,[username,pwd],function (err,result) {
            if(err){
                throw err;
                callback(0);
            }else{
                callback(1);
            }
        })
    })
}
exports.changePwd=(callback,newPwd,username,currentPwd)=>{
    pool.getConnection(function (err,connection) {
        connection.query(userSql.changePwd,[newPwd,username,currentPwd],function (err,result) {
            if(err){
                throw err;
                callback(0);
            }else{
                callback(1);
            }
        })
    })
}
//检查是否关注
exports.check_follow=(callback,username,followId)=>{
    pool.getConnection(function (err,connection) {
        connection.query(userSql.check_follow,[username,followId],function (err,result) {
            if(err){
                throw err;
                callback(0);
            }else{
                callback(result);
            }
        })
    })
}
exports.follow=(callback,username,followId)=>{
    pool.getConnection(function (err,connection) {
        connection.query(userSql.follow,[username,followId],function (result) {
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
exports.follow_cancel=(callback,username,followId)=>{
    pool.getConnection(function (err,connection) {
        connection.query(userSql.follow_cancel,[username,followId],function (result) {
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

exports.getPostRecord=(callback,username)=>{
    pool.getConnection(function (err,connection) {
        connection.query(userSql.getPostRecord,[username],function (err,result) {
            if(err){
                throw err;
            }else{
                for(let i=0;i<result.length;i++){
                    result[i].postTime=getDateDiff(result[i].postTime);
                }
                callback(result);
            }
            connection.release();
        })
    })
}
exports.getReplyRecord=(callback,username)=>{
    pool.getConnection(function (err,connection) {
        connection.query(userSql.getReplyRecord,[username],function (err,result) {
            if(err){
                throw err;
            }else{
                for(let i=0;i<result.length;i++){
                    result[i].commentTime=getDateDiff(result[i].commentTime);
                }
                callback(result);
            }
            connection.release();
        })
    })
}
exports.getCollectRecord=(callback,username)=>{
    pool.getConnection(function (err,connection) {
        connection.query(userSql.getCollectRecord,[username],function (err,result) {
            if(err){
                throw err;
            }else{
                for(let i=0;i<result.length;i++){
                    result[i].collectTime=getDateDiff(result[i].collectTime);
                }
                callback(result);
            }
            connection.release();
        })
    })
}
//修改头像
exports.changeUserHead=(callback,src,username)=>{
    pool.getConnection(function (err,connection) {
        connection.query(userSql.changeUserHead,[src,username],function (err,result) {
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
//获取关注数
exports.getFollow=(callback,username)=>{
    pool.getConnection(function (err,connection) {
        connection.query(userSql.getFollow,[username],function (err,result) {
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
//获取粉丝数
exports.getFans=(callback,followId)=>{
    pool.getConnection(function (err,connection) {
        connection.query(userSql.getFans,[followId],function (err,result) {
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
//收藏一条新闻
exports.collectNew=(callback,username,newId)=>{
    pool.getConnection(function (err,connection) {
        connection.query(userSql.collectNew,[username,newId],function (err,result) {
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
//取消收藏新闻
exports.collectNew_cancel=(callback,username,newId)=>{
    pool.getConnection(function (err,connection) {
        connection.query(userSql.collectNew_cancel,[username,newId],function (err,result) {
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
//删除发帖
exports.delPostrecord=(callback,commentId)=>{
    pool.getConnection(function(err,connection){
        connection.query(userSql.delPostrecord,[commentId],function(err,result){
            if(err){
                console.log(err);
                callback("0");
            }else{
                callback("1");
            }
            connection.release();
        })
    })
}

//获取管理的用户名单
exports.getusers=(callback,userId)=>{
    pool.getConnection(function(err,connection){
        connection.query(userSql.getusers,"admin",function(err,result){
            if(err){
                console.log(err);
                callback("0");
            }else{
                callback(result);
            }
            connection.release();
        })
    })
}

//添加用户禁言时间
exports.adduser_not=(callback,username,dateline)=>{
    pool.getConnection(function(err,connection){
        connection.query(userSql.add_not,[dateline,username],function(err,result){
            if(err){
                console.log(err);
                callback("0");
            }else{	
                console.log("添加成功");
				callback("1");
            }
            connection.release();
        })
    })
}
//封禁用户
exports.user_ban=(callback,username,dateline)=>{
    pool.getConnection(function(err,connection){
        connection.query(userSql.add_not,[dateline,username],function(err,result){
            if(err){
                console.log(err);
                callback("0");
            }else{	
                console.log("封号成功");
				callback("1");
            }
            connection.release();
        })
    })
}
//解禁
exports.free=(callback,username,dateline)=>{
    pool.getConnection(function(err,connection){
        connection.query(userSql.free,[dateline,username],function(err,result){
            if(err){
                console.log(err);
                callback("0");
            }else{	
                console.log("解禁成功");
				callback("1");
            }
            connection.release();
        })
    })
}
//删除帖子
exports.del_tie=(callback,del_id)=>{
    pool.getConnection(function(err,connection){
        connection.query(userSql.del_tie,[del_id],function(err,result){
            if(err){
                console.log(err);
                callback("0");
            }else{	
                console.log("解禁成功");
				callback("1");
            }
            connection.release();
        })
    })
}
//查看所有关注
exports.followRecord=(callback,username)=>{
    pool.getConnection(function(err,connection){
        connection.query(userSql.followRecord,[username],function(err,result){
            if(err){
                console.log(err);
                callback("0");
            }else{
                callback(result);
            }
            connection.release();
        })
    })
}
//查看所有粉丝
exports.fansRecord=(callback,username)=>{
    pool.getConnection(function(err,connection){
        connection.query(userSql.fansRecord,[username],function(err,result){
            if(err){
                console.log(err);
                callback("0");
            }else{
                callback(result);
            }
            connection.release();
        })
    })
}