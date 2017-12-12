var express=require('express');
var path=require('path');
var bodyParser=require("body-parser");
var session=require('express-session');
//将session信息保存到数据库中
var MongoStore = require('connect-mongo')(session);

var app=express();

//模版引擎文件
app.set('views',path.join(__dirname,'views'));
app.set('view engine','html');
app.engine('html',require('ejs').__express);

//静态资源文件
app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({ extended: true }));

//使用session模块
app.use(session({
	secret: 'come',
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({
		//数据库的连接地址
		url: require('./dbUrl').dbUrl
	})
}));
//公共路由
var home=require('./router/home');
var articles=require('./router/articles');
var use=require('./router/use');

//路由
app.use('/',home);
app.use('/articles',articles);
app.use('/user',use);

//
var server=app.listen(8890,function(){
	console.log("8890 is OK!");
});