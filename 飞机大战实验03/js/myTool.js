/*
 * 1:用$(selector,parent,tagName)函数获取标签
 * 2:用getStyle(obj,attr)来获取样式
 * 3:用move(obj,attr,rate,target,times,fn)来运动
 * 4:用ajax(options) 参数是一个json  封装的ajax；
 * 5:用saveCookie(cookieName,cookieValue,countDay) 来储存cookie
 * 6:用getCookie(cookieName) 来获取cookie值
 * 7:用getOffSet(obj) 获取元素的偏移值
 * 8:抖动函数shake(obj,attr,fudu,rate,fn);元素抖动
 * 
 * */


//封装的函数$ 用来获取标签的
function $(selector,parent,tagName){
	parent = parent || document;
	tagName = tagName || "*";
	var firstChar = selector.charAt(0);
	if(firstChar == "#"){
		return document.getElementById(selector.substring(1));
	}else if(firstChar == "."){
		var allEles = parent.getElementsByTagName(tagName);
		var arr = [];
		for(var i = 0; i < allEles.length; i++){
			var eleClassNames = allEles[i].className.split(" ");
			for (var j = 0; j < eleClassNames.length; j++){
				if(eleClassNames[j] == selector.substring(1)){
					arr.push(allEles[i]);
				}
			}
		}
		return arr;
	}else{
		return parent.getElementsByTagName(selector);
	}
}

//储存cookie
function saveCookie(cookieName,cookieValue,countDay){
	var date = new Date();
	date.setDate(date.getDate() + countDay);
	document.cookie = cookieName + "=" + encodeURIComponent(cookieValue)+";" + "expires=" + date.toGMTString();
}

//获取cookie值
function getCookie(cookieName){
	var arr=document.cookie.split("; ");
	for(var i=0;i<arr.length;i++){
		var newArr=arr[i].split("=");
		if(newArr[0]==cookieName){
			return encodeURIComponent(newArr[1]);
		}
	}
}

//获取子元素在页面中的偏移位置
function getOffSet(obj){
	var left = 0;
	var top = 0;
	while(obj){
		left += obj.offsetLeft;
		top += obj.offsetTop;
		obj = obj.offsetParent;
	}
	return {
		l:left,
		t:top
	}
}

//封装的ajax
function ajax(options){
	// 传入一个json 数据，里面放有一些参数
	//有默认的参数，如果传入的有参数，则按传入来，否则按默认来
	var defaults={
		method:options.method||"get",//数据提交方式的处理
		url:options.url,//请求地址
		data:options.data||"",//提交过去的数据
		successFn:options.successFn||null,//成功之后的回调
		dataType:options.dataType||""//指明一个数据类型，让ajax函数内部处理
	}
	
	//防止后端人员习惯性写大写，统一改成小写
	defaults.method=defaults.method.toLowerCase();
	
	//创建ajax对象，并兼容一下IE6
	var xhr =null;
	if(window.XMLHttpRequest){
		xhr=new XMLHttpRequest();
	}else{
		xhr=new ActiveXObject("Microsoft.XMLHTTP");
	}
	//如果方式是get请求 则将数据放到url+?的后面
	if(defaults.method=="get"){
		defaults.url+="?"+defaults.data;
	};
	//调用open 做发送前的准备
	xhr.open(defaults.method,defaults.url,true);
	//调用send方法 发送请求
	if(defaults.method=="post"){
		//需要给post请求方式  指定一个请求头 （请求头里面指明发送的数据格式）
		xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
		xhr.send(defaults.data);
	}else{
		xhr.send();
	}
	//当ajax状态码 发生改变的时候，触发该事件
	xhr.onreadystatechange=function(){
		//当ajax状态该变为4的时候
		if(xhr.readyState==4){
			if(xhr.status==200){
				
				//下面这块是处理执行返回指定格式的数据
				var returnMessage;
				if( defaults.dataType=="json"){
					returnMessage=JSON.parse(xhr.responseText);
				}else if(defaults.dataType=="xml"){
					returnMessage=xhr.responseXML;
				}else{
					returnMessage=xhr.responseText;
				}
				if(typeof defaults.successFn=="function"){
					defaults.successFn(returnMessage);
				};
			}else{
				alert( "错了错了,错误状态:"+xhr.status );
			}
		}
	}
	
}

//封装运动
function move(obj,attr,rate,target,times,fn){
	//  通过比较 当初的值 与运动到的目标值 谁大？ 目标值大 则rate是正数，否则当初值大，则负的
	rate =  parseInt( getStyle(obj,attr) ) > target ? -rate  :rate;
	//为了便于管理和清除定时器， 将定时器挂载到运动物体的自定义属性身上
	clearInterval(obj.timer);
	/*var rate=7;     */                        
	obj.timer=null;
	obj.timer=setInterval(function(){
		//每隔一段时间  获取一下最新的位置  然后加上一个速率
		var speed=parseInt( getStyle(obj,attr) )+rate;//100px==>100
		//在同一个运算表达式中，如果同时出现与运算 和或运算  与运算优先级高于或运算
		if((speed>=target&&rate>0)||(speed<=target&&rate<0)){
			//速度等于目标点
			speed=target;
		};
		//将速度赋给运动物体
		obj.style[attr]=speed+"px";//110
		if(speed==target){
			clearInterval(obj.timer);
			obj.timer=null;
			fn&&fn.call(obj);//短路写法
		}
	},times);
};

//获取样式
function getStyle(obj,attr){
		return obj.currentStyle ? obj.currentStyle[attr]: getComputedStyle(obj)[attr];
}

//抖动函数
function shake(obj,attr,fudu,rate,fn){
	if(obj.timer){
		return;
	}
	obj.timer = null;
	var arr=[];
	for(var i = fudu; i > 0; i -= rate){
		arr.push(i,-i);
	}
	arr.push(0);
	var num = 0;
	obj.timer = setInterval(function (){
		obj.style[attr] = parseFloat(getStyle(obj,attr)) + arr[num] + "px";
		num++;
		if(num >= arr.length){
			clearInterval(obj.timer);
			obj.timer = null;
			fn&&fn.call(obj);
		}
	},30)
}









