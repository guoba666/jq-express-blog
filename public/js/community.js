$(function(){
	//鼠标指向帖子标题变蓝
	$("div#leftDiv ul.list").on("mouseenter","li",function(){
		$(this).find("span.title").css("color","#008ee8");
	})
	$("div#leftDiv ul.list").on("mouseleave","li",function(){
		$(this).find("span.title").css("color","black");
	})
	var newInfo={
		"newId":1,
		"username":"麻辣锅巴",
		"head":"《命运2》",
		"content":"<p><b>全文武器</b></p><p><b>武器介绍：</b></p><p><b>1、暗杀</b></p><p><b>啊飒飒的</b>啊啊啊啊速度</p><p>啊是大撒旦啊",
		"postTime":"2019/12/01",
		"commentCount":125,
		"likeCount":12,
	}
	//将富文本字符串转为文本
	function strToText(str){
		var $div=$("<div></div>");
		$div.html(str);
		var text=$div.text();
		return text;
	}
	//将具体时间转化为小时前或者几天前
	function timeCal(){
		var date=new Date().getTime();
		var days = Math.floor(time_diff / (24 * 3600 * 1000));
		if (days > 0) {
			diff += days + '天';
		}
		alert();
	}
	//添加一条新闻
	function addNew(newInfo){
		//第一个div
		var $ul=$("div#leftDiv ul.list");
		var $li=$("<li></li>");
		$li.attr("cid",newInfo.newId);
		var $replyIconDiv=$("<div class='replyIcon-div'></div>");
		$replyIconDiv.append("<p name='icon'></p>");
		$replyIconDiv.find("p").text(newInfo.commentCount);
		$li.append($replyIconDiv);
		//第二个div
		var $contentInfoDiv=$("<div class='contentInfo-div'></div>");
		var $h3=$("<h3></h3>")
		$h3.append("<span class='title'>"+newInfo.head+"</span>");
		$h3.append("<p>"+strToText(newInfo.content)+"</p>");
		$contentInfoDiv.append($h3);
		$li.append($contentInfoDiv);
		//第三个div
		var $sendInfoDiv=$("<div class='sendInfo-div'></div>");
		var $h4=$("<h4></h4>");
		$h4.append("<img src='userHead/"+newInfo.src+".jpg' />");
		$h4.append("<span id='newslist-author'>"+newInfo.username+"</span>");
		var $span=$("<span>"+newInfo.postTime+"·"+newInfo.likeCount+"赞</span>");
		$sendInfoDiv.append($h4);
		$sendInfoDiv.append($span);
		$li.append($sendInfoDiv);
		//列表添加li
		$ul.append($li);
	}
	//刷新新闻展示列表
	function newsRefresh(cid){
		//先清空列表
		$("div#leftDiv ul.list").empty();
		$.ajax({
			type:"post",
			url:"getNews",
			data:{
				cid:cid,
			},
			dataType:"JSON",
			success:function(list){
				for(var i=0;i<list.length;i++){
					addNew(list[i]);
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("提交失败");
				alert(XMLHttpRequest.status);
				alert(XMLHttpRequest.readyState);
			}
		})
	}
	let comCid=getCookie("communityCid");
	let comName;
	newsRefresh(comCid);
	$("div#rightDiv img").attr("src","gameimg/"+comCid+".jpg");
	$("div#rightDiv h3").attr("community-cid",comCid);
	if(comCid==1){
		comName="命运2";
	}else if( comCid==2){
		comName="Apex";
	}else{
		comName="战双帕米什";
	}
	$("div#rightDiv h3").text(comName);
	//检查用户是否关注该作者
	check_follow=(username,followId,callback)=>{
		$.ajax({
			type:"post",
			url:"users/check_follow",
			data:{
				username:username,
				followId:followId
			},
			dataType:"JSON",
			success:function (data) {
				if(data[0].count!=0){
					callback(1);
				}else{
					callback(0);
				}
			},
			error:function (err) {
				alert("检查关注提交失败");
			}
		})
	}
    $("div#leftDiv ul.list").on("click","li",function () {
        var newId=$(this).attr("cid");
        var username=getCookie("username");
        var followId=$(this).find("span#newslist-author").text();
		window.location="getDetail?newId="+newId+"&username="+username+"&followId="+followId;
        /*
        check_follow(username,followId,function (message) {
        	window.location="getDetail?newId="+newId+"&isfollow="+message;
        });
         */
    })

	//选择浏览社区
	$("button#changeCom-btn").click(function () {
		$("div.choiceCom_wrapper").toggleClass("active");
	})
	$("div.part_wrapper").click(function () {
		$(this).find("input").prop("checked","true");
	})
	$("div.choiceCom_wrapper button").click(function () {
		$("div.choiceCom_wrapper").removeClass("active");
		$("ul.list").empty();
		let selectCid=$("input[name='select_com']:checked").val()
		$("div#rightDiv img").attr("src","gameimg/"+selectCid+".jpg");
		let com="a";
		if(selectCid==1){
			com="命运2";
		}else if( selectCid==2){
			com="Apex";
		}else{
			com="战双帕米什";
		}
		$("div#rightDiv h3").attr("community-cid",selectCid);
		$("div#rightDiv h3").text(com);
		newsRefresh(selectCid);
		setCookie("communityCid",selectCid);
	})

	$("button[name='post']").click(function () {
		window.location="post";
	})
})