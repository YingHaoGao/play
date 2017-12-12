$(function(){
//样式
	//信息条数提示框显示隐藏
	var alertAutoShowHidden=function (){
		$('.Gao-alert').animate({top:"60px",opacity:"0.8"},700,function(){
			setTimeout(function(){
				$('.Gao-alert').animate({top:"0px",opacity:"0"},700);
			},2000);
		});
	};
	
	var alertShow=function (obj,data){
		obj.attr({class:"alert alert-danger Gao-error"});
		obj.html(data.text).animate({top:"60px",opacity:"0.8"},700);
	};
	
	var alertHidden=function (obj){
		obj.animate({top:"0px",opacity:"0"},700);
	};
	
	//去掉input autocomplete的屎黄色
	// $('.container input').attr("autocomplete","off");
	
	// 背景图
	background();
	$(window).on('resize',background);

	function background() {
		var width=$(window).width();
		var height=$(window).height();

		$('body').css({
			backgroundSize:width+"px "+height+"px",
			width:width+'px',
			height:height+'px'
		});
	};
	
	//CanvasParticle
	var config = {
		vx: 2,//点x轴速度,正为右，负为左
		vy:  2,//点y轴速度
		height: 2,//点高宽，其实为正方形，所以不宜太大
		width: 2,
		count: 250,//点个数
		color: "40 ,40 , 40",//点颜色
		stroke: "62,62,62",//线条颜色
		dist: 6000,//点吸附距离
		e_dist: 20000,//鼠标吸附加速距离
		max_conn: 10//点到点最大连接数
	}
	
	//文章页提示框
	alertAutoShowHidden();
	
	//背景切换
	var backTog=sessionStorage.getItem("backTog")==undefined ? 0 :
		sessionStorage.getItem("backTog");
	
	back();
	$('.backBtn').on('click',function(){
		backTog= backTog==1 ? 0 : 1 ;
		back();
	});
	
	function back(){
		if(backTog==0){
			$('.pg-canvas').css("display","none");
			$('#backScript').html('<script src="/js/canvas-particle.js" ' +
				'type="text/javascript"></script>');
			$('.backDiv').attr('id','mydiv');
			$('body').css('background','');
			CanvasParticle(config);
		}else{
			$('.backDiv>canvas').remove();
			$('.pg-canvas').css("display","block");
			$('#backScript').html('<script type="text/javascript" src="/js/starry/jquery-ui.min.js"></script>' +
				'<script type="text/javascript" ' +
				'src="/js/starry/stopExecutionOnTimeout.js?t=1"></script>' +
				'<script src="/layui/layui.js" type="text/javascript"></script>' +
				'<script src="/js/starry/Particleground.js" ' +
				'type="text/javascript"></script>' +
				'<script src="/Js/starry/Treatment.js" type="text/javascript"></script>' +
				'<script src="/js/starry/jquery.mockjax.js" ' +
				'type="text/javascript"></script>');
			$('.backDiv').attr('id','Gao-canvas-div');
			$('body').css('background','url(../css/img/Starry.jpg)')
				.particleground({dotColor: '#E8DFE8', lineColor: '#133b88'});
		}
		
		sessionStorage.setItem("backTog",backTog);
	}
	
//用户注册
	$('.Gao-userReg').on('click',function(){
		alertHidden($('.Gao-error'));
		$.ajax({
			type:"post",
			url:"/user/reg",
			data:{
				username:$("#username").val(),
				password:$("#password").val(),
				date:new Date().getTime(),
				portrait:"",
				e_mail:""
			},
			success:function(data){
				if(data.isOk=="ok"){
					$('.Gao-error').attr({class:"alert alert-success Gao-error"});
					$('.Gao-error')
						.html('成功')
						.animate({top:"60px",opacity:"0.8"},700,function(){
							location.href="/articles/all";
						});
				}else{
					alertShow($('.Gao-error'),data);
				}
			}
		});
	});
	
//用户登录
	$('.Gao-userLogin').on('click',function(){
		alertHidden($('.Gao-error'));
		$.ajax({
			type:"post",
			url:"/user/login",
			data:{username:$("#username").val(),password:$("#password").val()},
			success:function(data){
				if(data.isOk=="ok"){
					location.href="/articles/all";
				}else{
					alertShow($('.Gao-error'),data)
				}
			}
		});
	});
//发表文章
	$('textarea').on("input",function(){
		var num=$(this).val().length;
		var color=num>300 ? "red" : "#ccc";
		var dis=num>300 ? true : false;
		
		$('.num>b').css("color",color).html(num);
		$('button[type=submit]').attr("disabled",dis);
	});
	
	$('.Gao-addarticle').on('click',function(){
		alertHidden($('.Gao-error'));
	});
	
//文章详情页
	$('.panel-body.classification').on('click',function(){
		var id=$(this).attr("index");
		var category=$('.dropdown-toggle.category').text();
		var other=$(this).attr("data-other");
		$.ajax({
			url:"/articles/contentInfo",
			type:"post",
			data:{id:id,category:category,other:other},
			success:function(data){
				location.href="/articles/contentInfo";
			}
		})
	});
	
//删除
	$('.Gao-delete-btn').on('click',function(){
		var id=$('.panel-body').attr("index");
		$.ajax({
			url:"/articles/delete",
			type:"post",
			data:{id:id},
			success:function(date){
				location.href="/articles/all";
			}
		})
	})
	
	
	// $('#fileupload').fileupload({
	// 	dataType: 'json',
	// 	add: function (e, data) {
	// 		data.context = $('.Gao-addarticle')
	// 			.click(function () {
	// 				$(this).replaceWith($('<p/>').text('Uploading...'));
	// 				data.submit();
	// 			});
	// 	},
	// 	done: function (e, data) {
	// 		data.context.text('Upload finished.');
	// 	}
	// });
	
	
	// function Gao_GetOutputDataSort(data){
	// 	var dataArr=[],_data={};
	// 	if(typeof data!='object'){
	// 		console.log('data格式不是obj')
	// 	}else{
	// 		$.each(data,function(key,val){
	// 			dataArr.push(val);
	// 		})
	// 		dataArr.sort(function(a,b){return a.id>b.id});
	// 		$.each(dataArr,function(idx,val){
	// 			_data["outputs_"+val.id]=val;
	// 		})
	// 		return _data;
	// 	}
	// }
	
	
});