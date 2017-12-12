var express=require('express');
var MongoClient=require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/mutong';
var route=express.Router();
var fs=require('fs');
//引入multer模块实现图片的上传
var multer = require('multer');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/uploads'); //上传图片后保存的路径地址
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname); //上传图片后图片的名字等于原来图片的名字
	}
});

var upload = multer({storage: storage}); //配置(upload是一个中间件处理函数)

var user,contentInfo;

route.get('/all',function(req,res){
	outToContent(res,req,"全部",'article/classification');
});

route.get('/comical',function(req,res){
	outToContent(res,req,"搞笑",'article/classification');
});

route.get('/affection',function(req,res){
	outToContent(res,req,"感情",'article/classification');
});

route.get('/fashion',function(req,res){
	outToContent(res,req,"时尚",'article/classification');
});

route.get('/entertainment',function(req,res){
	outToContent(res,req,"娱乐",'article/classification');
});

route.get('/contentInfo',function(req,res){
	contentInfoFun(res,req,contentInfo);
});

route.get('/add',function(req,res){
	res.render('article/addarticle',{classification:"全部",
		user:req.session.user.username});
});


route.post('/contentInfo',function(req,res){
	contentInfo=req.body;
	res.end();
});

route.post('/add',upload.single('img'),function(req,res){
	addArticle(res,req);
});

route.post('/delete',upload.single('img'),function(req,res){
	deleteArticle(res,req);
});

/*
*
*/

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
		result.sort(function(a,b){return b.date>a.date;});
		callback(result);
	});
};

var category_content = function(result,category){
	var content={};
	var arr=[];
	if(!result.length==0){
		content=result[0];
		result[0].articles.map(function(_val) {
			if (_val.category == category) {
				_val.date=getDate(_val.date);
				arr.push(_val);
			}
		});
		content.articles=arr;
	};
	
	return content;
};

var add0 = function(m){
	return m<10?'0'+m:m
};

var getDate = function (shijianchuo){
	var time = new Date(parseInt(shijianchuo));
	var y = time.getFullYear();
	var m = time.getMonth()+1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
};

var outToContent=function(res,req,str,html){
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		console.log("连接成功！");
		if(req.session.user==undefined){user=""}else{
			user=req.session.user.username;
		};
		selectData({}, db, function(result) {
			var content=[];
			if(!result.length==0){
				result.map(function(_val,_idx){
					_val.articles.map(function(__val,__key){
						if(str=="全部"){
							content.push(__val);
						}else{
							if(__val.category==str){
								content.push(__val);
							}
						}
					});
				})
			};
			content.sort(function(a,b){return a.date<b.date});
			content.map(function(val,key){
				val.date=getDate(val.date);
			});
			res.render(html,{
				classification:str,
				content:content,user:user
			});
			db.close();
		});
	});
};

var contentInfoFun=function (res,req,contentInfo){
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		console.log("连接成功！");
		if(req.session.user==undefined){user=""}else{
			user=req.session.user.username;
		};
		selectData({}, db, function(result) {
			var content=[];
			if(!result.length==0){
				result.map(function(_val,_idx){
					_val.articles.map(function(__val,__key){
						if(contentInfo.other==__val.other && __val.id==contentInfo.id){
							content.push(__val);
						}
					});
				})
			};
			content.sort(function(a,b){return a.date<b.date});
			content.map(function(val,key){
				val.date=getDate(val.date);
			});
			var msg=contentInfo.other==user ? "ok" : "no";
			res.render('article/contentInfo',{
				classification:contentInfo.category,
				content:content,user:user,msg:msg
			});
			db.close();
		});
	});
};

var addArticle=function (res,req){
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		console.log("连接成功！");
		selectData({username:req.session.user.username},db,function(result){
			var userInfor=result[0];
			var obj=req.body;
			obj.img = [];
			obj.date=new Date().getTime();
			obj.other=req.session.user.username;
			obj.id=userInfor.articles.length+1;
			if (req.file){ //如果有图片上传
				obj.img.push('/uploads/'+req.file.filename);
			}
			userInfor.articles.unshift(obj);
			var collection = db.collection('weibo');
			collection.update({username:userInfor.username},userInfor);
			res.redirect('/articles/all');
		});
	});
}

var deleteArticle=function (res,req){
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		console.log("连接成功！");
		if(req.session.user==undefined){user=""}else{
			user=req.session.user.username;
		};
		var id=req.body.id;
		selectData({username:user}, db, function(result) {
			var content=result[0];
			if(!result.length==0){
				content.articles.map(function(_val,_idx){
					if(_val.id==id){
						content.articles.splice(_idx,1);
					}
				});
			};
			var collection = db.collection('weibo');
			collection.update({username:user},content);
			res.end();
		});
	});
}

module.exports=route;