//引入mongoose模块
var mongoose=require('mongoose');

//连接数据库
mongoose.connect(require('../dbUrl').dbUrl);

//创建文章集合中的字段
var articleSchema=new mongoose.Schema({
	title:String,
	content:String,
	author:String,
	date:String
});

//创建文章集合
var articleModel=mongoose.model("articles",articleSchema);

//文章集合导出
module.exports.articleModel=articleModel;