function getCookie(c_name)
{
	if (document.cookie.length>0)
	{
		c_start=document.cookie.indexOf(c_name + "=")
		if (c_start!=-1)
		{
			c_start=c_start + c_name.length+1
			c_end=document.cookie.indexOf(";",c_start)
			if (c_end==-1) c_end=document.cookie.length
			return unescape(document.cookie.substring(c_start,c_end))
		}
	}
	return ""
}
function setCookie(c_name,value,expiredays)
{
	var exdate=new Date()
	exdate.setDate(exdate.getDate()+expiredays)
	document.cookie=c_name+ "=" +escape(value)+
		((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}
function delCookie(c_name)
{

	document.cookie=c_name+ "=" +escape(getCookie(c_name))+
		";expires=expires=Fri, 31 Dec 1999 23:59:59 GMT";
}

//删除帖子
function delPost(data){
	if(confirm("确认删除该帖子?")){
		$.ajax({
			type:"post",
			url:"users/delPostRecord",
			data:{
				cid:$(data).parents("li").attr("cid"),
			},
			dataType:"JSON",
			success:function (result) {
				if(result) {
					alert("删除成功");
					window.location.reload();
				}
				else alert("删除失败");
			},
		})
	}
}
$(function(){
    //收藏等操作信息反馈
    function successInfo(message){
        $("div[name='operator-successInfo'] span").text(" "+message);
        $("div[name='operator-successInfo']").addClass("active");
        setTimeout(function(){
            $("div[name='operator-successInfo']").removeClass("active");
        },3000);
    }
    function failInfo(message){
        $("div[name='operator-failInfo'] span").text(" "+message);
        $("div[name='operator-failInfo']").addClass("active");
        setTimeout(function(){
            $("div[name='operator-failInfo']").removeClass("active");
        },3000);
    }
	//获取头像
	$("div#rightDiv div.setting_wrapper img").prop("src","userHead/"+getCookie("userHead")+".jpg");
	//获取用户名
	$("div#rightDiv").find("p[name='identity-username']").text(getCookie("username"));
	//获取关注人数和粉丝人数
	getFollow=(callback,username)=>{
		$.ajax({
			type:"post",
			url:"users/getFollow",
			data:{
				username:username
			},
			dataType:"JSON",
			success:function (data) {
				callback(data[0].count);
			}
		})
	}
	getFans=(callback,username)=>{
		$.ajax({
			type:"post",
			url:"users/getFans",
			data:{
				followId:username
			},
			dataType:"JSON",
			success:function (data) {
				callback(data[0].count);
			}
		})
	}
	getFollow(function (count) {
		$("span#follow-count").text(count);
	},getCookie("username"));

	getFans(function (count) {
		$("span#fans-count").text(count);
	},getCookie("username"));

	//更换头像
	$("div.setting_wrapper").mouseenter(function(){
		$(this).find("img").addClass("dark");
		$(this).find("button.changeHead-btn").fadeIn();
	})
	$("div.setting_wrapper").mouseleave(function(){
		$(this).find("img").removeClass("dark");
		$(this).find("button.changeHead-btn").hide();
	})
	$("div.setting_wrapper button.changeHead-btn").click(function(){
		$("input#userHead-input").click();
		var $file=$("input#userHead-input");
		$file.off("change").on("change",function(){
			var formdata=new FormData();
			var picture=$file[0].files[0];
			formdata.append("userHead",picture);
			var picture_src=window.URL.createObjectURL(picture);
			$.ajax({
				type:"post",
				url:"users/userHeadUpload",
				data:formdata,
				cache:false,
				contentType:false,
				processData:false,
				dataType:"JSON",
				success:function (fileName) {
					if(fileName==null){
						alert("上传失败");
					}else{
						$.ajax({
							type:"post",
							url:"users/changeUserHead",
							data:{
								src:fileName,
								username:getCookie("username")
							},
							dataType:"JSON",
							success:function (message) {
								if(message==1){
									alert("上传成功");
									$("div.setting_wrapper img").prop("src","userHead/"+fileName+".jpg");
									$("div#leftNav img").prop("src","userHead/"+fileName+".jpg");
									setCookie("userHead",fileName,30);
								}else{
									alert("服务器保存失败!");
								}
							}
						})
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					alert("提交失败");
					alert(XMLHttpRequest.status);
					alert(XMLHttpRequest.readyState);
				}
			});

		})
	})
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

	//添加一行发帖记录
	function addPostRecord(postInfo){
		var $ul=$("div#show-list ul");
		var $li=$("<li></li>");
		$li.attr("cid",postInfo.newId);
		var $div1=$("<div></div>");
		var $div2=$("<div class='feedback-wrapper'></div>");
		var $p=$("<p name='post-time'></p>");
		$p.text(postInfo.postTime);
		var $h3=$("<h3></h3>");
		$h3.text(postInfo.head);
		$h3.click(function(){
			//因为是本人的发帖记录，所以username和followId均为本人
			window.location="getDetail?newId="+$li.attr("cid")+"&username="+getCookie("username")+"&followId="+getCookie("username");
		})
		$div1.append($p);
		$div1.append($h3);
		
		var $span1=$("<span class='glyphicon glyphicon-thumbs-up'></span>");
		$span1.text(postInfo.likeCount);
		var $span2=$("<span class='glyphicon glyphicon-comment'></span>");
		$span2.text(postInfo.commentCount);
		var $button_del=$("<button onclick='delPost(this)'>删除</button>");
		$div2.append($span1);
		$div2.append($span2);
		$div2.append($button_del);
		$div1.append($div2);
		$li.append($div1);
		$li.fadeIn();
		$ul.append($li);
	}

	var postInfo={
		"newId":"22",
		"postTime":"2019-12-10",
		"head":"宇涛SB",
		"likeCount":106,
		"commentCount":21
	}
	
	//添加一行回复记录
	function addReplyRecord(replyInfo){
		var $ul=$("div#show-list ul");
		var $li=$("<li></li>");
		$li.attr("cid",replyInfo.newId);
		/*
		$li.click(function(){
			check_follow(replyInfo.commentAuthor,replyInfo.newAuthor,function (message) {
				window.location="getDetail?newId="+replyInfo.newId+"&isfollow="+message;
			});
		})
		 */
		var $div1=$("<div></div>");
		var $div2=$("<div class='feedback-wrapper'></div>");
		
		var $p=$("<p name='post-time'></p>");
		$p.text(replyInfo.commentTime);
		var $h3=$("<h3></h3>");
		$h3.text(replyInfo.head);
		$h3.click(function(){
			window.location="getDetail?newId="+$li.attr("cid")+"&username="+getCookie("username")+"&followId="+replyInfo.newAuthor;
		})
		$div1.append($p);
		$div1.append($h3);
		var $h5=$("<h5>回复内容：</h5>");
		$div1.append($h5);
		var $replyContent=$("<p></p>");
		$replyContent.text(replyInfo.commentContent);
		$div1.append($replyContent);
		var $span1=$("<span class='glyphicon glyphicon-thumbs-up'></span>");
		$span1.text(replyInfo.commentLikeCount);
		$div2.append($span1);
		$div1.append($div2);
		$li.append($div1);
		$li.fadeIn();
		$ul.append($li);
	}
	var replyInfo={
		"newId":"22",
		"postTime":"2019-12-10",
		"head":"宇涛SB",
		"likeCount":106,
		"content":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊",
	}
	
	//添加一行收藏记录
	function addCollectRecord(collectInfo){
		var $ul=$("div#show-list ul");
		var $li=$("<li></li>");
		$li.attr("cid",collectInfo.newId);
		var $div1=$("<div></div>");
		var $div2=$("<div class='feedback-wrapper'></div>");
		
		var $p=$("<p name='post-time'></p>");
		$p.text(collectInfo.collectTime+" 收藏了");
		var $h3=$("<h3></h3>");
		$h3.text(collectInfo.head);
		$h3.click(function(){
			window.location="getDetail?newId="+$li.attr("cid")+"&username="+getCookie("username")+"&followId="+collectInfo.newAuthor;
		})
		$div1.append($p);
		$div1.append($h3);
		var $span1=$("<span class='glyphicon glyphicon-thumbs-up'></span>");
		$span1.text(collectInfo.likeCount);
		var $span2=$("<span class='glyphicon glyphicon-comment'></span>");
		$span2.text(collectInfo.commentCount);
		$div2.append($span1);
		$div2.append($span2);
		$div1.append($div2);
		$li.append($div1);
		$ul.append($li);
	}
	var collectInfo={
		"newId":"22",
		"postTime":"2019-12-10",
		"head":"宇涛SB",
		"likeCount":106,
		"commentCount":9,
	}
	
	$("div#info-nav li p").click(function(){
		$("div#info-nav ul").children().not(this).each(function(){
			$(this).find("div").removeClass("active");
			$(this).find("p").css("color","gray");
		})
		$(this).siblings("div.nav-line").addClass("active");
		$(this).css("color","black");
		$("div#show-list ul").empty();
		var btn=$(this).text();
		if(btn=="发帖"){
			$.ajax({
				type:"post",
				url:"users/getPostRecord",
				data:{
					username:getCookie("username")
				},
				dataType:"JSON",
				success:function (list) {
					for(var i=0;i<list.length;i++){
						addPostRecord(list[i]);
					}
				},
			})
		}else if(btn=="回复"){
			$.ajax({
				type:"post",
				url:"users/getReplyRecord",
				data:{
					username:getCookie("username")
				},
				dataType:"JSON",
				success:function (list) {
					for(var i=0;i<list.length;i++){
						addReplyRecord(list[i]);
					}
				},
			})
		}else if(btn=="收藏"){
			$.ajax({
				type:"post",
				url:"users/getCollectRecord",
				data:{
					username:getCookie("username")
				},
				dataType:"JSON",
				success:function (list) {
					for(var i=0;i<list.length;i++){
						addCollectRecord(list[i]);
					}
				},
			})
		}else{
			
		}
	})
	//初始自动获取发帖记录
	$("div#info-nav ul li:first-of-type p").click();

	//退出登陆
	$("button#backup-btn").click(function () {
		delCookie("username");
		delCookie("userHead");
		delCookie("connect.sid");
		setTimeout(function () {
			window.location="/";
		},1500);
	})
	//修改密码按钮
	$("div#changePwd-wrapper input").focus(function () {
		$(this).siblings("span").addClass("active");
	})
	$("div#changePwd-wrapper input").focusout(function () {
		var span=$(this).siblings("span");
		if($(this).val().length<1){
			span.css("color","red");
			$(this).css("border-color","red");
		}else{
			$(this).css("border-color","green");
			span.css("color","green");
		}
	})
	$("div#changePwd-wrapper input[name='confirmPwd']").focusout(function () {
		if($(this).val()!=$("div#changePwd-wrapper input[name='newPwd']").val()){
			$(this).siblings("span").text("两次输入的密码不一致");
			$(this).siblings("span").css("color","red");
			$(this).css("border-color","red");
		}else{
			$(this).siblings("span").text("再次输入新密码");
			$(this).siblings("span").css("color","green");
			$(this).css("border-color","green");
		}
	})
	//确认修改
	$("button#confirmChangePwd-btn").click(function () {
		$.ajax({
			type:"post",
			url:"users/changePwd",
			data:{
				username:getCookie("username"),
				currentPwd:$("div#changePwd-wrapper input[name='currentPwd']").val(),
				newPwd:$("div#changePwd-wrapper input[name='newPwd']").val(),
			},
			dataType:"JSON",
			success:function (message) {
				if(message==1){
					$("div#changePwd-wrapper").hide();
					successInfo("密码修改成功");
				}else{
					failInfo("密码修改失败");
				}
			}
		})
	})


	$("div.followAfans_wrapper").children().each(function () {
		$(this).css("cursor","pointer");
	})
	//关注和粉丝详情栏展开/隐藏
	$("div.followAfans_wrapper").children().click(function () {
		//对长度进行判断防止多次请求
		if($("ul#followDiv").children().length<1){
			$("ul#followDiv").empty();
			$.ajax({
				type:"post",
				url:"users/followRecord",
				data:{
					username:getCookie("username"),
				},
				dataType:"JSON",
				success:function (list) {
					for(let i=0;i<list.length;i++){
						addFollower(list[i]);
					}
				},
			})
		}
		if($("ul#fansDiv").children().length<1){
			$("ul#followDiv").empty();
			$.ajax({
				type:"post",
				url:"users/fansRecord",
				data:{
					username:getCookie("username"),
				},
				dataType:"JSON",
				success:function (list) {
					for(let i=0;i<list.length;i++){
						addFans(list[i]);
					}
				},
			})
		}

		$("div.followAndFans-wrapper").toggle("slow");
	})
	$("div.followAndFans-wrapper span.glyphicon.glyphicon-remove").click(function () {
		$("div.followAndFans-wrapper").toggle("slow");
	})
	//关注和粉丝按钮
	$("ul.identityUl-wrapper li p").click(function() {
		$("ul.identityUl-wrapper").children().not(this).each(function () {
			$(this).find("div").removeClass("active");
			$(this).find("p").css("color", "gray");
		})
		$(this).siblings("div.nav-line").addClass("active");
		$(this).css("color","black");
		if($(this).text()=="关注"){
			$("ul#followDiv").fadeIn();
			$("ul#fansDiv").hide();
		}else{
			$("ul#followDiv").hide();
			$("ul#fansDiv").fadeIn();
		}
	})
	//添加一行关注
	function  addFollower(user) {
		var $ul=$("div.FAdisArea-wrapper").find("ul#followDiv");
		var $li=$("<li></li>");
		$li.append("<img src='userHead/"+user.src+".jpg'>");
		$li.append("<span>"+user.name+"</span>");
		var btn=$("<button>已关注</button>");
		btn.click(function () {
			if(confirm("真的要取关他吗:(")){
				$.ajax({
					type:"post",
					url:"users/follow_cancel",
					data:{
						username:getCookie("username"),
						followId:user.name,
					},
					success:function (message) {
						successInfo("取关成功");
						$li.remove();
					}
				})
			}
		})
		$li.append(btn);
		$ul.append($li);
	}

	//添加一行粉丝
	function  addFans(fans) {
		var $ul=$("div.FAdisArea-wrapper").find("ul#fansDiv");
		var $li=$("<li></li>");
		$li.append("<img src='userHead/"+fans.src+".jpg'>");
		$li.append("<span>"+fans.name+"</span>");

		check_follow(getCookie("username"),fans.name,function (message) {
			if(message===1){
				var btn=$("<button>已关注</button>");
				btn.click(function () {
					if(confirm("确认取关他吗:(")){
						$.ajax({
							type:"post",
							url:"users/follow_cancel",
							data:{
								username:getCookie("username"),
								followId:fans.name,
							},
							success:function (message) {
								successInfo("取关成功");
								btn.text("关注");
							}
						})
					}
				})
			}else{
				var btn=$("<button>关注</button>");
				btn.click(function () {
					$.ajax({
						type:"post",
						url:"users/follow",
						data:{
							username:getCookie("username"),
							followId:fans.name,
						},
						success:function (message) {
							successInfo("关注成功");
							btn.text("已关注");
						}
					})
				})
			}
			$li.append(btn);
		});
		$ul.append($li);
	}

})	
