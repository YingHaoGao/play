var express=require("express");

//创建路由容器
var route=express.Router();

route.get('/',function(req,res){
	var user;
	if(req.session.user==undefined){user=""}else{user=req.session.user.username};
	console.log("user", user);
	res.render('article/home',{classification:"全部",user:user});
});

module.exports=route;