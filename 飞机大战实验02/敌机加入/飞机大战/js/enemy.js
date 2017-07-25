//定义通过tagNamehuo获取标签 参数e为标签名
function $1(e){
	return document.getElementsByTagName(e);
}
//定义通过ID名获取标签
function $(eid){
	return document.getElementById(eid);
}

//定义开关变量:true：按键没按下的状态；false：按键按下状态
var flag = true;

//定义变量储存定时器
var t1 = null, t2 = null; t3 = null; t4 = null;

//定义变量储存当前可视窗口大小
var bWidth = document.documentElement.clientWidth || document.body.clientWidth;
var bHeight = document.documentElement.clientHeight || document.body.clientHeight;

//定义飞机向右移动事件
function planeMoveRight(){
	//获取飞机当前的偏移
	var getPlaneLeft = $("plane").offsetLeft;
	getPlaneLeft += 3;//飞机移动距离
	/*判断边界问题:
	 * 不能超出游戏范围
	 * */
	//右边界
	if(getPlaneLeft + $('plane').offsetWidth >= bWidth){
		getPlaneLeft = bWidth - $('plane').offsetWidth;
	}
	//飞机出现的位置
	$('plane').style.left = getPlaneLeft + "px";
}

//定义飞机向左移动事件
function planeMoveLeft(plane){
	//获取飞机当前的偏移
	var getPlaneLeft = $('plane').offsetLeft;
	getPlaneLeft -= 3;//飞机移动距离
	/*判断边界问题:
	 * 不能超出游戏范围
	 * */
	//左边界
	if(getPlaneLeft < 0){
		getPlaneLeft = 0;
	}
	//飞机出现的位置
	$('plane').style.left = getPlaneLeft + "px";
}

//定义按键事件
document.onkeydown = function (e){
	e = e || window.event;
	//按下向右的键
	if(e.keyCode == 39){
		if(flag){
			flag = false;
			planeBGRight($('plane'));
			t1 = setInterval(planeMoveRight,10);
		}
	}
	//按下向左的键
	if(e.keyCode == 37){
		if(flag){
			flag = false;
			planeBGLeft($('plane'));
			t2 = setInterval(planeMoveLeft,10);
		}
	}
	//按下发射子弹的键
	if(e.keyCode == 65 || e.keyCode == 97){
		createRocket();
	}
	//同时按下移动和发射
	if(e.keyCode == 39 && (e.keyCode == 65 || e.keyCode == 97)){
		createRocket();
		if(flag){
			flag = false;
			planeBGRight($('plane'));
			t1 = setInterval(planeMoveRight,10);
		}
	}
	if(e.keyCode == 37 && (e.keyCode == 65 || e.keyCode == 97)){
		createRocket();
		if(flag){
			flag = false;
			planeBGLeft($('plane'));
			t2 = setInterval(planeMoveLeft,10);
		}
	}
}

//定义按键抬起事件
document.onkeyup = function (e){
	e = e || window.Event;
	if(e.keyCode == 37 || e.keyCode == 39){
		if(flag == false){
			flag = true;
			clearInterval(t1);
			clearInterval(t2);
			$('plane').style.backgroundPositionX = "-412px"
		}
	}
}

//定义创建子弹的方法
function createRocket(){
	//创建新的标签rocket
	var rocket = document.createElement('rocket');
	//新的标签添加
	$('plane').appendChild(rocket);
	rocketMove(rocket);
}
/*定义子弹运动方法
 *参数：新建的rocket标签
 * */
function rocketMove(rocket){
	//console.log($('plane').childNodes);
	//定义变量储存当前飞机的位置
	var planeLeft = $('plane').offsetLeft;
		
	t3 = setInterval(function(){
		//获取子弹的垂直位置
		var rocketTop = rocket.offsetTop;
		//console.log(rocket.parentNode)
		//子弹移动的距离
		rocketTop -= 5;
		//判断子弹是否出了游戏区域
		if(rocketTop <= 0){
			//超出消失
			//rocket.style.display = "none";
			$('plane').removeChild(rocket);
			return;
		}
		//没有超出赋值
		rocket.style.top = rocketTop + "px";
		rocket.style.left = planeLeft + 70 + "px";
	},10)
}

//定义plane移动时背景图变化
//向右
function planeBGRight(plane){
	setTimeout(function(){
		plane.style.backgroundPositionX = "-631px";
	},100);
	setTimeout(function(){
		plane.style.backgroundPositionX = "-828px";
	},200)
}
//向左
function planeBGLeft(plane){
	setTimeout(function(){
		plane.style.backgroundPositionX = "-212px";
	},100);
	setTimeout(function(){
		plane.style.backgroundPositionX = "-28px";
	},200)
}


/*------------------------敌机加入---------------------------*/

//定义敌机的运动
function enemyMove(enemy){
	//获取当前敌机的水平位置
	var getEnemyLeft = enemy.offsetLeft;
	var tEnemy = setInterval(function(){
		//获取敌机垂直的位置
		var getEnemyTop = enemy.offsetTop;
		getEnemyTop += 1;//每次移动的位置
		//判断是否超区可视范围
		if(getEnemyTop + enemy.offsetHeight >= bHeight){
			//enemy.style.display = "none";
			$('box').removeChild(enemy);
			clearInterval(tEnemy);
		}
		//移动后赋值
		enemy.style.top = getEnemyTop + "px";
	},10)
}
//定义敌机显示方法
function createEnemy(){
	var times = 30 + Math.floor(Math.random()*3)*950;
	setInterval(function(){
		//创建一个新的enemy标签
		var enemy = document.createElement("enemy");
		//把新建的enemy的标签添加到box里
		$('box').appendChild(enemy);
		//设置新的enemy标签的样式
		enemy.style.left = Math.floor(Math.random() * 840) + 80 + "px";
		enemyMove(enemy);
	},times);
}
//敌机显示
window.onload = function () {
	createEnemy();
	setInterval(function(){
		pengZhuang();
	},1);
}

//定义子弹和敌机何时发生碰撞的函数
function pengZhuang(){
	//获取所有的子弹
	var rockets = $1('rocket');
	//获取所有的敌机
	var enemys = $1('enemy');
	for (var i = 0; i < enemys.length; i++){
		for(var j = 0; j < rockets.length; j++){
			if(enemys[i].offsetTop + enemys[i].offsetHeight >= rockets[j].offsetTop && enemys[i].offsetLeft + 32 <= rockets[j].offsetLeft && enemys[i].offsetLeft + 65 >= rockets[j].offsetLeft){	
				//发生碰撞
				enemys[i].setAttribute("class",'zha');
				$('plane').removeChild(rockets[j]);
				tu(enemys[i]);
			}
		}
	}
}

//定义碰撞时的背景图变化参
function tu(a){
	var c = 1;
	var t3 = setInterval(function(){
		if(c > 10){
			clearInterval(t3);
			$('box').removeChild(a)
		}
		a.style.background = "url(img/img"+c+".png)";
		c++;
	},50)

}


