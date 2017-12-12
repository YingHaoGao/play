var express = require('express');
var session = require('express-session');

var app = express();

app.use(session({
	secret: 'come',
	resave: true,
	saveUninitialized: true
}));

app.get('/write', function (req, res) {
	req.session.name = "chenchao"; //向session中写入信息
	res.send('写入session成功');
});

app.get('/read', function (req, res) {
	res.send(req.session.name);//读取session
});

//记录客户端访问次数
app.get('/visit', function (req, res) {
	var count = req.session.count;  //获取
	if (count){
		count = parseInt(count)+1;
	} else {
		count = 1;
	}
	req.session.count = count;  //设置
	res.send('欢迎您第'+count+'次访问');
});



app.listen(8888);