$(function(){//鼠标指向帖子标题变蓝
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
		$div_del=$("<div onclick=del_tie(this) class=del-tie>删除<div>");
		$li.append($div_del);
		$ul.append($li);
	}
	//刷新新闻展示列表
	function newsRefresh(){
		//先清空列表
		// $("div#leftDiv ul.list").empty();
		$.ajax({
			type:"post",
			url:"getNewsByAM",
			data:{

			},
			dataType:"JSON",
			success:function(list){
				for(var i=0;i<list.length;i++){
					addNew(list[i]);
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("查询新闻提交失败");
				alert(XMLHttpRequest.status);
				alert(XMLHttpRequest.readyState);
			}
		})
	}
	newsRefresh();

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
	//判断是否为数字
	function isNumber(val) {
	    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
	    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
	    if(regPos.test(val) || regNeg.test(val)) {
	        return true;
	        } else {
	        return false;
	        }
	    }
	//格式化日期
	function formatDateTime(date){
		let y = date.getFullYear();
		let m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		let d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		let h = date.getHours();
		h=h < 10 ? ('0' + h) : h;
		let minute = date.getMinutes();
		minute = minute < 10 ? ('0' + minute) : minute;
		let second=date.getSeconds();
		second=second < 10 ? ('0' + second) : second;
		return y + '-' + m + '-' + d + " 00:00:00";
	}
	
	function checkTime(stime,etime){
	　　 //通过replace方法将字符串转换成Date格式
	    var sdate= new Date(Date.parse(stime.replace(/-/g,   "/")));    
	    var edate= new Date(Date.parse(etime.replace(/-/g,   "/")));
	    //获取两个日期的年月日
	    var smonth=sdate.getMonth()+1;
	    var syear =sdate.getFullYear();
	    var sday = sdate.getDate();
	     
	    var emonth=edate.getMonth()+1;
	    var eyear =edate.getFullYear();
	    var eday = edate.getDate();
	     //从年，月，日，分别进行比较
	    if(syear>eyear){
	        return false;
	    }else{
	        if(smonth>emonth){
	            return false;
	        }else{
	            if(sday>eday){
	                return false;
	            }else{
	                return true;
	            }
	        }
	    }
	}
	//添加一条管理用户信息
	var count=1;//用户id
	
	function adduser(users){
		var date=new Date();
		date=formatDateTime(date);
		var check=users.key;
		var $tr=$("<tr></tr>");
		var $td_id=$("<td></td>").text(count);
		count++;
		var $td_pasw=$("<td></td>").text(users.pwd);
		var $td_opera=$("<td></td>")
		var $td_name=$("<td id=key></td>");
		var $img=$("<img></img>").attr("src","userHead/"+users.src+".jpg");
		$td_name.append($img);
		$td_name.append(users.username)
		var $td_btn_1=$("<button onclick=getdate(this) data-toggle=modal  data-target=#myModal>禁言</button>");
		var $td_btn_2=$("<button  onclick=ban(this)>封号</button>");
		var $td_btn_3=$("<button  onclick=free(this)>解禁</button>");
		$td_time=$("<td></td>").text(users.key);
		if(checkTime(JSON.stringify(check).replace(' ','T').substring(0,11),date)) 	var $td_time=$("<td></td>").text("无");
		else var $td_time=$("<td></td>").$td_time=$("<td></td>").text(JSON.stringify(check).replace(/T/g,' ').replace(/.[\d]{3}Z/,' ').substring(1,20));
		if(getdateyear(check,date)>50){
			var $td_feng=$("<td></td>").text("是");
		}
		else{
			var $td_feng=$("<td></td>").text("否");
		}
		$td_opera.append($td_btn_1);
		$td_opera.append($td_btn_2);
		$td_opera.append($td_btn_3);
		$tr.append($td_id);
		$tr.append($td_name);
		$tr.append($td_pasw);
		$tr.append($td_time);
		$tr.append($td_feng);
		$tr.append($td_opera);
		$("tbody").append($tr);
	}

	function getdateyear(date1,date2){
		var date_1= new Date(Date.parse(date1.replace(/-/g,   "/")));
		var date_2= new Date(Date.parse(date2.replace(/-/g,   "/")));
		return date_1.getFullYear()-date_2.getFullYear();
	}
	//展示用户列表
	function display(){
		$("table.table tbody").empty();
		$.ajax({
			type:"post",
			url:"users/getusers",
			data:{
				
			},
			dataType:"JSON",
			success:function(list){
				for(var i=0;i<list.length;i++){
					adduser(list[i]);
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("提交失败");
				alert(XMLHttpRequest.status);
				alert(XMLHttpRequest.readyState);
			}
		});
	}
	display();
	//设置禁言时间
	$("#set_date").click(function(){
		if(isNumber($("input#dateline").val())){
			var date=new Date();
			date=date.setDate(date.getDate()+parseInt($("input#dateline").val()));
			date=new Date(date);
			$.ajax({
				type:"post",
				url:"users/addnot",
				data:{
					"key_name":$("#key_name").text(),
					"dateline":formatDateTime(date),
				},
				dataType:"JSON",
				success:function(list){
					if(list){
						alert("禁言成功!")
						window.location.reload();
						$("li#2").click();
					}
						
					// for(var i=0;i<list.length;i++){
					// 	adduser(list[i]);
					// }
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					alert("提交失败");
					alert(XMLHttpRequest.status);
					alert(XMLHttpRequest.readyState);
				}
			});
		}
		else{
			alert("请输入数字");
		}
	});
	//导航栏css控制
	$("li#2").click(function(){
		$("li#1").removeClass();
		$("li#2").addClass("active");
		$("div#leftDiv").css("display","inline-block");
		$("div#cendiv").css("display","none");
	});
	$("li#1").click(function(){
		$("li#2").removeClass();
		$("li#1").addClass("active");
		$("div#leftDiv").css("display","none");
		$("div#cendiv").css("display","inline-block");
	});
	
});

//模拟框存储username
function getdate(data){
	$("#key_name").append($(data).parents("td").siblings("#key").text());
}

//封号
function ban(data){
	if(confirm("确定封号?")){
		var date=new Date();
		date=date.setDate(date.getDate()+"1000");
		date=new Date(date);
		$.ajax({
			type:"post",
			url:"users/ban",
			data:{
				"ban_name":$(data).parents("td").siblings("#key").text(),
				"dateline":formatDateTime(date),
			},
			dataType:"JSON",
			success:function(list){
				if(list)
					alert("封号成功!");
				window.location.reload();
				// for(var i=0;i<list.length;i++){
				// 	adduser(list[i]);
				// }
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("提交失败");
				alert(XMLHttpRequest.status);
				alert(XMLHttpRequest.readyState);
			}
		});
	}
}


//解禁
function free(data){
	var date=new Date();
	$.ajax({
		type:"post",
		url:"users/free",
		data:{
			"free_name":$(data).parents("td").siblings("#key").text(),
			"dateline":formatDateTime(date),
		},
		dataType:"JSON",
		success:function(list){
			if(list)
				alert("解禁成功!");
			window.location.reload();
			// for(var i=0;i<list.length;i++){
			// 	adduser(list[i]);
			// }
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			alert("提交失败");
			alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
		}
	});
}
//阻止冒泡事件
function cancelBubble(e) {
  		var evt = e ? e : window.event;
         if(evt.stopPropagation) { //W3C 
 				  evt.stopPropagation();
 				 } else { //IE      
				 evt.cancelBubble = true;
       	}
}
//删除帖子
function del_tie(data){
	// alert($(data).parents("li").attr("cid"));
	if(confirm("确定删除帖子?")){
		$.ajax({
			type:"post",
			url:"users/del_tie",
			data:{
				"del_tie":$(data).parents("li").attr("cid"),
			},
			dataType:"JSON",
			success:function(list){
				if(list){
					alert("删除成功!");
					window.location.reload();
					$("a#soc").click();
				}

				// for(var i=0;i<list.length;i++){
				// 	adduser(list[i]);
				// }
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("提交失败");
				alert(XMLHttpRequest.status);
				alert(XMLHttpRequest.readyState);
			}
		});
	}
	cancelBubble();
}

//格式化日期
function formatDateTime(date){
	let y = date.getFullYear();
	let m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	let d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	let h = date.getHours();
	h=h < 10 ? ('0' + h) : h;
	let minute = date.getMinutes();
	minute = minute < 10 ? ('0' + minute) : minute;
	let second=date.getSeconds();
	second=second < 10 ? ('0' + second) : second;
	return y + '-' + m + '-' + d+' '+'00:00:00';
}

