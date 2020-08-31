$(function(){
	let comCid=getCookie("communityCid");
	let comName;
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
	//比较时间 参数为字符串 格式为YY-MM-DD 00:00:00
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
		 // alert(syear);
		 // alert(eyear);
	    if(syear>eyear){  //1999 2019	
	        return false;
	    }
		else if(syear==eyear){
			if(smonth>emonth){
	            return false;
	        }
			else if(smonth==emonth){
				if(sday>eday){
					return false;
				}
				else return true;
			}
			else{
				return true;
			}
		}
		else{
	        return true;
	    }
	}
	//格式化时间
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

	//实时显示标题输入字数
	$("div.title-input input").keyup(function(){
		var len=$(this).val().length;
		$("span.limit-word").text(len);
	})
	
	//获取草稿内容
	function getLocalStorage(){
		$("input#editHead-input").val(localStorage.getItem("editHead"));
		$("div#edit-area").html(localStorage.getItem("editContent"));
	}
	getLocalStorage();
	
	//保存草稿
	$("button#saveContent-btn").click(function(){
		var editHead=$("input#editHead-input").val();
		var editContent=$("div#edit-area").html();
		localStorage.setItem("editHead",editHead);
		localStorage.setItem("editContent",editContent);
		alert("保存成功!");
	})

	//用户上传新闻
	$("button#post-btn").click(function () {
		$.ajax({
			type:"post",
			url:"check_al",
			data:{
				"key_name":$("span#nav-username").text(),
			},
			dataType:"JSON",
			success:function (check) {
				var now=new Date();
				now=formatDateTime(now);
				// alert(checkTime(JSON.stringify(check).substring(0,11),now));
				if(checkTime(JSON.stringify(check).substring(0,11),now)){
					var author=getCookie("username");
					var head=$("input#editHead-input").val();
					var content=$("div#edit-area").html();
					$.ajax({
						type:"post",
						url:"postNew",
						data:{
							author:author,
							head:head,
							content:content,
							cid:getCookie("communityCid"),
						},
						dataType:"JSON",
						success:function (message) {
							if(message==1){
								successInfo("发布成功");
								setTimeout(function () {
									window.location="community";
								},2000);
							}else{
								failInfo("发布失败");
							}
						},
						error: function (XMLHttpRequest, textStatus, errorThrown) {
							alert("提交失败");
							alert(XMLHttpRequest.status);
							alert(XMLHttpRequest.readyState);
						},
					})
				}
				else{
					alert("你已经被禁言 禁言截止到"+JSON.stringify(check).replace(/T/g,' ').replace(/.[\d]{3}Z/,' ').substring(1,20));
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("提交失败");
				alert(XMLHttpRequest.status);
				alert(XMLHttpRequest.readyState);
			}
		});
	})

	//清空按钮(包括localStorage和编辑区内容)
	function clearAllContent(){
		$("input#editHead-input").val("");
		$("div#edit-area").html("");
		localStorage.clear();
		successInfo("清除成功");
	}
	$("button#clearAllContent-btn").click(function(){
		clearAllContent();
	})
	
	/*封装tool功能*/
	//标题
	function addTitle(){
		$("button[title='添加标题']").toggleClass("using");
		document.execCommand('formatBlock',true,'h4');
		document.execCommand("Bold",false,null);
	}
	//加粗
	function toBold(){
		$("button[title='加粗']").toggleClass("using");
		document.execCommand("Bold",false,null);
	}
	//插入链接
	function addLink(hrefName,hrefAddress){
		//获取编辑区的焦点
		$("div#edit-area").focus();
		if(document.execCommand("insertHTML",false,"<a href="+hrefAddress+">"+hrefName+"</a>")){
			$("div#addLink-div").hide();
		}
	}
	//插入图片
	function addPicture(url){
		document.execCommand("insertImage",false,url);
	}
	
	/*具体工具按钮*/
	$("button[title='加粗']").click(function(){
		toBold();
	})
	$("button[title='添加标题']").click(function(){
		addTitle();
	})
	//链接弹出界面
	$("button[title='添加链接']").click(function(){
		$("button[title='添加链接']").toggleClass("using");
		$("div#addLink-div").toggle();
	})
	//插入链接
	$("button#insert-btn").click(function(){
		var hrefName=$("div#addLink-div input[name='hrefName']").val();
		var hrefAddress=$("div#addLink-div input[name='hrefAddress']").val();
		addLink(hrefName,hrefAddress);
		
	})
	$("button[title='上传图片']").click(function(){
		$("input#addPicture-input").click();
		var $file=$("input#addPicture-input");
		$file.off("change").on("change",function(){
			var formdata=new FormData();
			var picture=$file[0].files[0];
			formdata.append("picture",picture);
			var picture_src=window.URL.createObjectURL(picture);
			$.ajax({
				type:"post",
				url:"pictureUpload",
				data:formdata,
				cache:false,
				contentType:false,
				processData:false,
				dataType:"JSON",
				success:function (fileName) {
					alert("上传成功");
					//获取编辑区焦点
					$("div#edit-area").focus();
					addPicture(fileName);
					$("img[src='"+fileName+"']").css("width","640px");
					$("img[src='"+fileName+"']").css("height","400px");

				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					alert("提交失败");
					alert(XMLHttpRequest.status);
					alert(XMLHttpRequest.readyState);
				}
			});

		})
		
	})
	
	
	//为首行添加p标签
	$("div#edit-area").on("focus keyup",function(){
		var len=$(this).children().length;
		if(len==0){
			document.execCommand("formatBlock",false,"<p>");
		}
	})
	//回车键添加<p>标签
	$("div#edit-area").keyup(function(event){
		if(event.keyCode==13){
			document.execCommand("formatBlock",false,"<p>");
		}
	})

	
})