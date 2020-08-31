
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
if(!getCookie("username")){
	alert("请先登陆,即将跳转");
	window.location="/cblogin";
}
$(function(){

	//显示菜单状态切换按钮
	$("div#leftNav").mouseenter(function(){
		$("button#toggleNav").fadeIn();
	})
	$("div#leftNav").mouseleave(function(){
		$("button#toggleNav").fadeOut();
	})
	//菜单状态切换
	$("button#toggleNav").click(function(){
		$("div#leftNav").toggleClass("sleep");
		$("div[name='flex-box']").toggleClass("moveRight");
		if($("div#leftNav").hasClass("sleep")){
			setTimeout(function(){
				$("button#toggleNav").fadeOut();
			},700)
		}
	})
	
	
	$(document).mousemove(function(e){
		$("#mouseLocation").text(e.pageX);
		if(e.pageX==0 && $("div#leftNav").hasClass("sleep")){
			$("button#toggleNav").fadeIn();
			
		}
		
	})

	//用户头像
	$("div#leftNav img#userHead").prop("src","userHead/"+getCookie("userHead")+".jpg");
	//用户名
	$("div#leftNav span#nav-username").text(getCookie("username"));
})

$(function(){
	if($("span#nav-username").text()=="admin"){
		$("a#admin-a").css("display","block");
		$("a#dataStatis-a").css("display","block");
	}
});