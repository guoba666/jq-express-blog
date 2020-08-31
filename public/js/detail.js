$(function(){
	$("div#content-area").focus(function(){
		$("div#commentEdit-area-content-bottom").css("border-color","#008ee8");
	})
	$("div#content-area").focusout(function(){
		$("div#commentEdit-area-content-bottom").css("border-color","#f1f2f3");
	})
	
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
	
	//收藏按钮
	$("button#detail-title-btn-love").click(function(){
		var icon=$(this).find("span:first-of-type");
		var info=$(this).find("span:last-of-type");
		var $this=$(this);
		//未收藏
		if(icon.hasClass("glyphicon-star-empty")){
			//后台处理并返回处理结果
			//...
			$.ajax({
				type:"post",
				url:"users/collectNew",
				data:{
					username:getCookie("username"),
					newId:$this.parent().attr("cid")
				},
				dataType:"JSON",
				success:function (message) {
					if(message==1){
						successInfo("收藏成功");
						info.text("已收藏");
						$this.css("background-color","#FFCC00");
						icon.toggleClass("glyphicon glyphicon-star-empty");
						icon.toggleClass("glyphicon glyphicon-star");
					}else{
						failInfo("收藏失败");
					}
				},
				error:function (err) {
					alert("失败");
				}
			})

		}else{
			$.ajax({
				type:"post",
				url:"users/collectNew_cancel",
				data:{
					username:getCookie("username"),
					newId:$this.parent().attr("cid")
				},
				dataType:"JSON",
				success:function (message) {
					if(message==1){
						successInfo("取消收藏");
						info.text("收藏");
						$this.css("background-color","");
						icon.toggleClass("glyphicon glyphicon-star-empty");
						icon.toggleClass("glyphicon glyphicon-star");
					}else{
						failInfo("取消收藏失败");
					}
				}
			})
		}

	})
	//回帖按钮锚链接
	$("button#detail-title-btn-comment").click(function(){
		window.location.href="#commentEdit-area-content";
	})

	//关注按钮
	$("button#follow-btn").click(function(){
		var icon=$(this).find("span:first-of-type");
		var info=$(this).find("span:last-of-type");
		var $this=$(this);
		var username=getCookie("username");
		var author=$("div.detail-author div.info-div h5").text();
		if(username==author){
			failInfo("不能关注自己!");
		}else{
			if(icon.hasClass("glyphicon-sm glyphicon-plus")){
				//后台处理并返回处理结果
				$.ajax({
					type:"post",
					url:"users/follow",
					data:{
						username:username,
						followId:author
					},
					success:function (message) {
						if(message==1){
							successInfo("关注成功");
							info.text("已关注");
							$this.css("background-color","#D8D8D8");
						}
						else{
							failInfo("操作失败");
						}
					}
				})
			}else{
				$.ajax({
					type:"post",
					url:"users/follow_cancel",
					data:{
						username:getCookie("username"),
						followId:$("div.detail-author div.info-div h5").text()
					},
					success:function (message) {
						if(message==1){
							successInfo("取消关注");
							info.text("关注");
							$this.css("background-color","");
						}else{
							failInfo("操作失败");
						}
					}
				})
			}
			icon.toggleClass("glyphicon-sm glyphicon-plus");
			icon.toggleClass("glyphicon glyphicon-ok followed");
		}
	})
	//点赞
	$("button#detail-footer-up-btn").click(function(){
		if($("button#detail-footer-down-btn").hasClass("clicked")){
			$("button#detail-footer-down-btn").removeClass("clicked");
			$("button#detail-footer-down-btn").find("span").toggleClass("clicked");
		}
		var info=$(this).find("span:nth-of-type(2)");
		var count=$("span#thumbs-upCount");
		if(info.text()=="赞"){
			info.text("已赞");
			$(this).children().css("color","white");
			count.text(parseInt(count.text())+1);
			$(this).css("background-color","#008EE8");
			successInfo("操作成功");
		}else{
			info.text("赞");
			$(this).children().css("color","#008EE8");
			count.text(parseInt(count.text())-1);
			$(this).css("background-color","");
			successInfo("操作成功");
		}
	})
	//踩
	$("button#detail-footer-down-btn").click(function(){
		var upbtn=$("button#detail-footer-up-btn");
		var upInfo=$("button#detail-footer-up-btn").find("span:nth-of-type(2)");
		var count=$("span#thumbs-upCount");
		if(upInfo.text()=="已赞"){
			upInfo.text("赞");
			upbtn.children().css("color","#008EE8");
			count.text(parseInt(count.text())-1);
			upbtn.css("background-color","");
		}
		$(this).toggleClass("clicked");
		$(this).find("span").toggleClass("clicked");
		successInfo("操作成功");
	})


	//评论点赞
	$("ul.dislist").on("click","div.commentLove-wrapper span:first-of-type",function(){
        var btn=$(this);
        var count=$(this).siblings("#commentLike-count");
	    //判断是否已点了踩
	    if(btn.siblings("#commentDislike").hasClass("clicked")){
			//后台处理
            $.ajax({
                type:"post",
                url:"commentDislike_cancel",
                data:{
                    commentId:btn.parent().parent().attr("comment-cid")
                },
            })
            btn.siblings("#commentDislike").toggleClass("clicked");
        }

		if(btn.hasClass("clicked")){
            $.ajax({
                type:"post",
                url:"commentLike_cancel",
                data:{
                    commentId:btn.parent().parent().attr("comment-cid")
                },
                success:function (message) {
                    if(message==1){
                        successInfo("操作成功")
                        count.text(parseInt(count.text())-1);
                        btn.toggleClass("clicked");
                        count.toggleClass("clicked");
                    }else{
                        failInfo("操作失败");
                    }
                }
            })
		}else{
            $.ajax({
                type:"post",
                url:"commentLike",
                data:{
                    commentId:btn.parent().parent().attr("comment-cid")
                },
                success:function (message) {
                    if(message==1){
                        successInfo("操作成功")
                        count.text(parseInt(count.text())+1);
                        btn.toggleClass("clicked");
                        count.toggleClass("clicked");
                    }else{
                        failInfo("操作失败");
                    }
                }
            })
		}


	})
	//评论踩
	$("ul.dislist").on("click","div.commentLove-wrapper span#commentDislike",function(){
		//判断是否点了赞
	    var upbtn=$(this).siblings("span:first-of-type");
	    var downbtn=$(this);
		var count=$(this).siblings("#commentLike-count");
		if(upbtn.hasClass("clicked")){
		    $.ajax({
                type:"post",
                url:"commentLike_cancel",
                data:{
                    commentId:upbtn.parent().parent().attr("comment-cid")
                },
            })
			count.text(parseInt(count.text())-1);
			upbtn.toggleClass("clicked");
			count.toggleClass("clicked");
		}
		if(downbtn.hasClass("clicked")){
            $.ajax({
                type:"post",
                url:"commentDislike_cancel",
                data:{
                    commentId:upbtn.parent().parent().attr("comment-cid")
                },
                success:function (message) {
                    if(message==1){
                        downbtn.toggleClass("clicked");
                        successInfo("操作成功");
                    }
                }
            })
        }else{
            $.ajax({
                type:"post",
                url:"commentDislike",
                data:{
                    commentId:upbtn.parent().parent().attr("comment-cid")
                },
                success:function (message) {
                    if(message==1){
                        downbtn.toggleClass("clicked");
                        successInfo("操作成功");
                    }
                }
            })
        }

	})

	//添加一条评论
	function addComment(commentInfo,floor){
		var $ul=$("div.commentDisplay-area ul.dislist");
		var $li=$("<li></li>");
		$li.attr("comment-cid",commentInfo.commentId);
		var $div1=$("<div class='commentUserHead-warpper'></div>");
		var $div2=$("<div class='commentInfo-wrapper'></div>");
		var $div3=$("<div class='commentLove-wrapper'></div>");
		//div1
		$div1.append("<img name='comment-userhead' src='userHead/"+commentInfo.src+".jpg' />");
		//div2
		var $div2_1=$("<div class='commentUserInfo-wrapper'></div>");
		$div2_1.append("<h5>"+commentInfo.username+"</h5>");
		$div2_1.append("<span>"+floor+"楼 "+"</span>");
		$div2_1.append("<span>"+commentInfo.commentTime+"</span>");
		$div2.append($div2_1);

		var $div2_2=$("<div class='commentContent-wrapper'></div>");
		$div2_2.append("<p>"+commentInfo.content+"</p>");
		$div2.append($div2_2);

		var $div2_3=$("<div class='commentReply-wrapper'></div>");
		//添加评论回复(2019.12.17)
		var $div2_3_1=$("<div class='replyToggle-wrapper'></div>");
		var $div2_3_2=$("<div class='reply-list'></div>");
		$div2_3_2.append("<ul></ul>");
		var $div2_3_2_1=$("<div class='addNewReply-wrapper'></div>");
		$div2_3_1.append("<span class='glyphicon glyphicon-comment'></span>");
		if(commentInfo.replyCount==0){
			$div2_3_1.append("<span name='span-replyCount'>添加评论</span>");
		}else{
			$div2_3_1.append("<span name='span-replyCount'>"+commentInfo.replyCount+"条评论</span>");
		}
		$div2_3_2_1.append("<input name='replyContent' type='text' class='form-control' placeholder='评论'/>");
		$div2_3_2_1.append("<button name='replySend-btn'>发送</button>");
		$div2_3_2.append($div2_3_2_1);
		$div2_3.append($div2_3_1);
		$div2_3.append($div2_3_2);
		//

		$div2.append($div2_3);
		//div3
		$div3.append("<span class='glyphicon glyphicon-thumbs-up'></span>");
		$div3.append("<span id='commentLike-count'>"+commentInfo.likeCount+"</span>");
		$div3.append("<span id='commentDislike' class='glyphicon glyphicon-thumbs-down'></span>");
		$li.append($div1);
		$li.append($div2);
		$li.append($div3);
		$ul.append($li);
	}
	//刷新评论列表
	function commentRefresh(){
		$("div.display-wrapper ul.dislist").empty();
		$.ajax({
			type:"post",
			url:"getComment",
			data:{
				"newId":$("div.detail-title").attr("cid")
			},
			dataType:"JSON",
			success:function(list){
				for(var i=0;i<list.length;i++){
					addComment(list[i],i+2);
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("评论列表加载失败");
				alert(XMLHttpRequest.status);
				alert(XMLHttpRequest.readyState);
			}
		})
	}
	commentRefresh();

	//发表评论的用户信息
	$("img#commentEdit-area-userHead").prop("src","userHead/"+getCookie("userHead")+".jpg");
	$("div#commentEdit-area-content h5").text(getCookie("username"));

	//发送评论
	$("div#commentEdit-tool button#commentSend-btn").click(function(){
		var newId=$("div.detail-title").attr("cid");
		var content=$("div#commentEdit-area-content-bottom div#content-area").text();
		var username=getCookie("username");
		$.ajax({
            type:"post",
            url:"sendComment",
            data:{
                newId:newId,
                content:content,
                username:username
            },
            dataType:"JSON",
            success:function (message) {
                if(message==1){
                	$.ajax({
						type:"post",
						url:"/commentCount_add",
						data:{
							newId:newId
						},
						success:function (message) {
							if(message==1){
								successInfo("发送评论成功");
								$("div#commentEdit-area-content-bottom div#content-area").text("");
								commentRefresh();
							}else{
								failInfo("发送评论失败");
							}
						}
					})

                }else{
                    failInfo("发送评论失败");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("评论发送出错");
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
            }
        })
	})


	//在某一评论中添加一条回复
	function addReply(replyInfo,commentId){
		var $commentLi=$("ul.dislist li[comment-cid='"+commentId+"']")
		var $ul=$commentLi.find("div.reply-list ul");
		var $li=$("<li></li>");
		var $div1=$("<div class='replyInfo-wrapper'></div>");
		var $div2=$("<div class='replyBtn-wrapper'></div>");
		var $div1_1=$("<div class='replyUser-wrapper'></div>");
		$div1_1.append("<img src='userHead/"+replyInfo.src+".jpg' />");
		$div1_1.append("<span name='replyer'>"+replyInfo.replyer+" </span>");
		$div1_1.append("<span class='glyphicon glyphicon-triangle-right'></span>");
		$div1_1.append("<span name='receiver'> "+replyInfo.receiver+"</span>");
		var $div1_2=$("<div class='replyContent-wrapper'></div>")
		$div1_2.append("<p>"+replyInfo.replyContent+"</p>");

		$div1.append($div1_1);
		$div1.append($div1_2);

		$div2.append("<span class='glyphicon glyphicon-comment'></span>");
		$div2.append("<span>回复</span>");
		$li.append($div1);
		$li.append($div2);
		$ul.append($li);
	}
	//刷新某一评论的回复记录
	function replyRefresh(commentId){
		//先清空已有的记录
		$("ul.dislist li[comment-cid='"+commentId+"']").find("div.reply-list ul").empty();
		//再重新加载
		$.ajax({
			type:"post",
			url:"getReplyByCommentId",
			data:{
				commentId:commentId,
			},
			success:function (result) {
				if(result!=null){
					for(let i=0;i<result.length;i++){
						addReply(result[i],commentId);
					}
				}
			},
			error:function () {
				alert("刷新回复记录失败");
			}
		})
	}
	//评论回复列表展开/隐藏(如果已经隐藏，则先加载数据后展开)
	$("ul.dislist").on("click","div.commentReply-wrapper div.replyToggle-wrapper",function(){
		var commentId=$(this).parents("li").attr("comment-cid");
		var ulLen=$(this).siblings("div.reply-list").find("ul").children().length;

		//如果回复列表隐藏且未加载过，则请求数据
		if($(this).siblings("div.reply-list").is(':hidden') && ulLen==0){
			$.ajax({
				type:"post",
				url:"getReplyByCommentId",
				data:{
					commentId:commentId,
				},
				success:function (result) {
					if(result!=null){
						for(let i=0;i<result.length;i++){
							addReply(result[i],commentId);
						}
					}
				},
				error:function () {
					alert("获取回复失败");
				}
			})
		}
		$(this).siblings("div.reply-list").toggle("fast");

	})

	//回复具体一条评论的按钮，隐藏/显示切换
	$("ul.dislist").on("mouseenter","div.reply-list ul li",function(){
		$(this).find("div.replyBtn-wrapper").show();
	})
	$("ul.dislist").on("mouseleave","div.reply-list ul li",function(){
		$(this).find("div.replyBtn-wrapper").hide();
	})
	//点击回复按钮锁定回复人
	$("ul.dislist").on("click","div.reply-list ul li div.replyBtn-wrapper",function(){
		let receiver=$(this).parent().find("span[name='replyer']").text();
		if(receiver==(getCookie("username")+" ")){
			failInfo("不能回复自己...");
		}else {
			$(this).parents("div.reply-list").find("input[name='replyContent']").prop("placeholder", "回复" + receiver + ":");
			//获取输入框焦点
			$(this).parents("div.reply-list").find("input[name='replyContent']").focus();
		}
	})
	//判断发送按钮是否可用
	$("ul.dislist").on("keyup","li input[name='replyContent']",function(){
		if($(this).val().length>0){
			$(this).siblings("button").css("background-color","#008ee8");
			$(this).siblings("button").css("color","white");
			$(this).siblings("button").css("cursor","pointer");
		}else{
			$(this).siblings("button").css("background-color","#f1f2f3");
			$(this).siblings("button").css("color","#c8cdd2");
			$(this).siblings("button").css("cursor","not-allowed");
		}
	})

	//回复某一评论按钮
	$("ul.dislist").on("click","li button[name='replySend-btn']",function () {
		let commentId=$(this).parents("li").attr("comment-cid");
		let replyer=getCookie("username");
		let input_placeholder=$(this).siblings("input").prop("placeholder");
		//默认回复层主
		let floorer=$(this).parents("div.commentInfo-wrapper").find("h5").text();
		let receiver=floorer;

		let replyContent=$(this).siblings("input").val();
		let $input=$(this).siblings("input");
		let replySpan=$(this).parents("div.commentReply-wrapper").find("span[name='span-replyCount']");
		let replyCount=$(this).parents("div.commentReply-wrapper").find("span[name='span-replyCount']").text().split("评论")[0];
		//判断回复人是谁（默认为层主）
		if(input_placeholder!="评论"){
			receiver=input_placeholder.split("回复")[1].split(":")[0];
		}
		$.ajax({
			type:"post",
			url:"sendReply",
			data:{
				commentId:commentId,
				replyer:replyer,
				receiver:receiver,
				replyContent:replyContent,
			},
			dataType:"JSON",
			success:function (message) {
				if(message==1){
					$.ajax({
						type:"post",
						url:"replyCount_add",
						data:{
							commentId:commentId,
						},
						dataType:"JSON",
						success:function (message) {
							if(message==1){
								successInfo("回复成功");
								replyRefresh(commentId);
								$input.val("");
								if(replyCount=="添加"){
									replySpan.text("1条评论");
								}else{
									replyCount=parseInt(replyCount.split("条")[0])+1;
									replySpan.text(replyCount+"条评论");
								}
							}else{
								failInfo("回复失败");
							}
						}
					})
				}else{
					failInfo("回复失败");
				}
			},
			error:function () {
				alert("提交失败");
			}
		})

	})
})