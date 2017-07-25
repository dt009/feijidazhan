window.onload = function (){
	var show00 = true;
	$("#container").style.display = "none";
	document.onkeydown = function(e){
		e = e || window.event;
		if(show00){
			show00 = false;
			if(e.keyCode == 13){
				$("#start").style.display = "none";
				$("#container").style.display = "block";
				bGMove();
				//记录得分
				var score = $("#score");
				//获取自己的飞机
				var plane = $("#plane");
				
				//获取游戏区域的大小
				var bHeight = $("#box").offsetHeight;
				var bWidth = $("#box").offsetWidth;
				
				//定义变量储存延时器
				var tt1 = null; 
				
				//定义一个开关变量
				var flag = true;
				var onOff = true;
				//敌机出现
				var times = 300 + Math.ceil(Math.random()*3)*600
				var t1 = setInterval(function(){
					createEnemy();
				},times);
				//定义键盘按下事件
				document.onkeydown = function(e){
					e = e || window.event;
					if(e.keyCode == 39){
						if(flag){
							flag = false;
							fanZhuanRight();
							move(plane,"left",5,bWidth-plane.offsetWidth,20);
					}
				}
				if(e.keyCode == 37){
					if(flag){
						flag = false;
						fanZhuanLeft();
						move(plane,"left",5,0,20);
					}
				}
				if(e.keyCode == 65 || e.keyCode == 97){
					if(onOff){
						onOff = false;
						createRocket();
					}
				}
				if(e.keyCode == 39 && (e.keyCode == 65 || e.keyCode == 97)){
					createRocket();
					if(flag){
						flag = false;
						move(plane,"left",5,bWidth-plane.offsetWidth,20);
					}
				}
				if(e.keyCode == 37 && (e.keyCode == 65 || e.keyCode == 97)){
					createRocket();
					if(flag){
						flag = false;
						move(plane,"left",5,0,20);
						}
					}
				}
				document.onkeyup = function (e){
					e = e || window.event;
					
					if(e.keyCode == 39 || e.keyCode == 37){
						if(flag == false){
							flag = true;
							clearTimeout(tt1);
							plane.style.backgroundPositionX = "-412px";
							clearInterval(plane.timer);
						}
					}
					if(e.keyCode == 65 || e.keyCode == 97){
						if(onOff == false){
							onOff =true;
						}
					}
				}
				
				//击中敌机
				pengZhuang();
				
				zhuang();
			}
		}
	}
	
	
}

//定义创建子弹的事件
function createRocket(){
	var s = document.createElement('span');
	$("#box").appendChild(s);
	//获取飞机现在的位置，并定义子弹的位置
	s.style.left = (plane.offsetLeft + 73) + "px";
	move(s,"top",10,-32,30,function(){
		$("#box").removeChild(s);
	})
}

//创建敌机
function createEnemy(){
	var div = document.createElement("div");
	div.className = "enemy";
	$("#box").appendChild(div);
	div.style.left = 30 + Math.floor(Math.random()*($("#box").offsetWidth - 188)) + "px";
	move(div,"top",5,$("#box").offsetHeight,25,function(){
		$("#box").removeChild(div);
		var taoyi = $("#taoyi").innerText;
		taoyi++;
		$("#taoyi").innerHTML = taoyi;
		if(taoyi >= 15){
			alert("手残党不适合玩游戏。。")
			$("#taoyi").innerHTML = "15";
			$("#container").style.display = 'none';
			window.history.go(0);
			
			show00 = true;
			return;
		}
	})
}

//飞机的反转效果
function fanZhuanRight(){
	plane.style.backgroundPositionX = "-631px";
	tt1 = setTimeout(function(){
		plane.style.backgroundPositionX = "-828px";
	},100)
}
function fanZhuanLeft(){
	plane.style.backgroundPositionX = "-212px";
	tt1 = setTimeout(function(){
		plane.style.backgroundPositionX = "-28px";
	},100)
}

//定义子弹和飞机发生碰撞
function pengZhuang(){
	var getScore = 0;
	setInterval(function(){
		//获取所有的敌机和子弹
		var rockets = $("span");
		var enemys = $(".enemy",$("#box"),"div");
		//判断发生碰撞
		for(var i = 0; i < enemys.length; i++){
			for(var j = 0; j < rockets.length; j++){
				if(enemys[i].offsetTop + enemys[i].offsetHeight >= rockets[j].offsetTop && enemys[i].offsetLeft + 32 <= rockets[j].offsetLeft && enemys[i].offsetLeft + 65 >= rockets[j].offsetLeft){
					//发生碰撞
					//$("#box").removeChild(enemys[i]);
					$("#box").removeChild(rockets[j]);
					baoZha(enemys[i]);
					getScore+=10;
					score.innerText = getScore;
					if(getScore >= 10000){
						alert("恭喜您。。顺利完成任务。。")
					}
				}
			}
		}
	},1)
}

//创建爆炸效果
function baoZha(obj){	
	obj.className = "zha";
	obj.style.position = 'absolute';
	obj.style.height = "107px";
	obj.style.width = "92px";
	zha(obj);
}
//爆炸是背景图的变化
function zha(a){
	var c = 1;
	var t3 = setInterval(function(){
		if(c > 10){
			clearInterval(t3);
			$('#box').removeChild(a)
		}
		a.style.background = "url(img/img"+c+".png)";
		c++;
	},50)
}

//飞机和敌机相撞
function zhuang(){
	var a = 10;
	setInterval(function (){
		//获取所有的敌机
		var enemy = $(".enemy",$("#box"),"div");
		for(var i = 0; i < enemy.length; i++){
			//获取飞机位置
			var planeTop = plane.offsetTop;
			var planeLeft = plane.offsetLeft;
			//敌机和飞机相遇的位置
			var enemyTop = enemy[i].offsetTop + enemy[i].offsetHeight;
			var enemyLeft = enemy[i].offsetLeft;
			//判断
			if(planeTop <= enemyTop && planeLeft - enemy[i].offsetWidth <= enemyLeft && planeLeft + plane.offsetWidth >= enemyLeft){
				a--;
				baoZha(enemy[i]);
				$("#blood").innerText = a;
				shake($("#box"),"left",30,2)
				if(a <= 0){
					$("#box").removeChild($("#plane"));
					baoZha(enemy[i]);
					alert("机毁人亡，告别历史的舞台。。")
					$("#container").style.display = 'none';
					window.history.go(0);
					return;
				}
			}
		}
	},0.1)
}

//整个大的背景图移动
function bGMove(){
	Y = -9320;
	setInterval(function(){
		Y+=1;
		//console.log(Y);
		if(Y >= -900){
			Y = -9320;
		}
		$("#box").style.backgroundPositionY = Y + "px";
	},20)
}








