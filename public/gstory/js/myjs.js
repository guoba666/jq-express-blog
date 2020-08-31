function con_change(name){
	document.getElementById(name).style.transform="rotateX(-180deg)";
}
function con_recover(name){
	document.getElementById(name).style.transform="rotate(0deg)";
}
$(function () {
	var x;
    $(".dropdown").mouseover(function(){
		$(this).addClass("open");
		x=1;
	});
	
	dropdownMenu_1_menu.onmouseleave=function(){
		setTimeout(function(){
			$(".dropdown").removeClass("open");
		},1);
		x=0;
	}
	dropdownMenu_2_menu.onmouseleave=function(){
		setTimeout(function(){
			$(".dropdown").removeClass("open");
		},1);
		x=0;
	}
	if(x){
		$(".dropdown").mouseover(function(){
			$(this).removeClass("open");
		});
	}
	// $(".dropdown").mouseout(function(){
	// 	$(this).removeClass("open");
	// });
})

function show_message(){
	var user=document.getElementById("user");
	var password=document.getElementById("password");
	var email=document.getElementById("email");
	if(user.value==""){
		user.style.border="1px solid red";
		user.placeholder="用户名不能为空";
		user.focus();
	}
	else{
		user.style.border="1px solid #ccc";
	}
	
	if(password.value==""){
		password.style.border="1px solid red";
		password.placeholder="密码不能为空";
		password.focus();
	}
	else{
		password.style.border="1px solid #ccc";
	}
	
	if(email.value==""){
		email.style.border="1px solid red";
		email.placeholder="请输入电子邮箱";
		email.focus();
	}
	else{
		email.style.border="1px solid #ccc";
	}
}
