var express=require('express');
var MongoClient=require('mongodb').MongoClient;
var DB_CONN_STR = require('../dbUrl').dbUrl;
var route=express.Router();

var md5=require('../md5/md5');

//注册
route.get('/reg',function(req,res){
	res.render('use/reg',{classification:"全部",user:""});
});
//获取注册信息
route.post('/reg',function(req,res){
	var userInfo=req.body;
	userInfo.articles=[];
	userInfo.password=md5(req.body.password);
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		selectData({username:userInfo.username}, db, function(result) {
			if(result.length==0){
				insertData(userInfo, db, function(result) {
					console.log(result);
					req.session.user = userInfo;
					res.send({isOk:"ok",text:''});
					db.close();
				});
			}else{
				res.send({isOk:"no",text:'当前用户已注册，请更换用户名!'});
			}
		});
	});
});

//登录
route.get('/login',function(req,res){
	res.render('use/login',{classification:"全部",user:""});
});
//获取登录信息
route.post('/login',function(req,res){
	var userInfo=req.body;
	userInfo.password=md5(req.body.password);
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		console.log("连接成功！");
		selectData(userInfo, db, function(result) {
			if(result.length==0){
				res.send({isOk:"no",text:'用户名或密码错误，请重新输入！'});
			}else{
				req.session.user = userInfo;
				res.send({isOk:"ok",text:''});
			}
		});
	});
});

//退出
route.get('/logout',function(req,res){
	req.session.user = null;//清空session中的登陆信息
	res.redirect('/');
});


var insertData = function(data ,db, callback) {
	//连接到表 site
	var collection = db.collection('weibo');
	//插入数据
	collection.insert(data, function(err, result) {
		if(err)
		{
			console.log('Error:'+ err);
			return;
		}
		callback(result);
	});
};

var selectData = function(whereStr, db, callback) {
	//连接到表
	var collection = db.collection('weibo');
	//查询数据
	collection.find(whereStr).toArray(function(err, result) {
		if(err)
		{
			console.log('Error:'+ err);
			return;
		}
		result.sort(function(a,b){return b.ms>a.ms;});
		callback(result);
	});
};

module.exports=route;