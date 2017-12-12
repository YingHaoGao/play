module.exports=function(_value){
	var crypto=require("crypto");
	
	crypto.getHashes();
	
	var md5=crypto.createHash('md5');
	
	md5.update(_value);
	
	var result=md5.digest('hex');
	
	return result;
};